package club.foxprof.translator02

import android.Manifest
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import org.json.JSONObject
import java.io.File
import java.util.Base64

private enum class Language(val code: String, val label: String) {
    SK("sk", "Slovenčina"), DE("de", "Deutsch")
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { TranslatorScreen() }
    }
}

@Composable
fun TranslatorScreen() {
    var source by remember { mutableStateOf(Language.SK) }
    var target by remember { mutableStateOf(Language.DE) }
    var listening by remember { mutableStateOf(false) }
    var busy by remember { mutableStateOf(false) }
    var transcript by remember { mutableStateOf("") }
    var translation by remember { mutableStateOf("") }
    var status by remember { mutableStateOf("Pripravené na rozhovor") }
    var recorder by remember { mutableStateOf<MediaRecorder?>(null) }
    var recordingFile by remember { mutableStateOf<File?>(null) }
    val scope = rememberCoroutineScope()
    val context = androidx.compose.ui.platform.LocalContext.current

    val permissionLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) {
            startRecording(context, recorder, recordingFile) { r, f -> recorder = r; recordingFile = f; listening = true; status = "🎤 Počúvam…" }
        } else status = "Mikrofón je potrebný na preklad hlasu."
    }

    MaterialTheme {
        Surface(Modifier.fillMaxSize()) {
            Column(Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(18.dp)) {
                Text("FOX 02", style = MaterialTheme.typography.headlineLarge)
                Text("LIVE AI TRANSLATOR", style = MaterialTheme.typography.titleMedium)
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedButton(onClick = { val old = source; source = target; target = old }) {
                        Text("${source.label} ⇄ ${target.label}")
                    }
                }
                Text(status)
                Text(if (transcript.isBlank()) "Ty (${source.label})" else transcript)
                Text(if (translation.isBlank()) "Protistrana (${target.label})" else translation)
                Button(
                    modifier = Modifier.fillMaxWidth(), enabled = !busy,
                    onClick = {
                        if (!listening) {
                            if (androidx.core.content.ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                                permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
                            } else {
                                startRecording(context, recorder, recordingFile) { r, f -> recorder = r; recordingFile = f; listening = true; status = "🎤 Počúvam…" }
                            }
                        } else {
                            listening = false
                            try { recorder?.stop() } catch (_: RuntimeException) { }
                            recorder?.release(); recorder = null
                            status = "Spracúvam hlas…"
                            val file = recordingFile
                            if (file != null) {
                                busy = true
                                scope.launch {
                                    try {
                                        val result = translateVoice(file, source.code, target.code)
                                        transcript = result.transcript
                                        translation = result.translation
                                        status = "Preklad hotový"
                                        result.audio?.let { playAudio(it) }
                                    } catch (e: Exception) {
                                        status = "Chyba: ${e.message ?: "neznáma chyba"}"
                                    } finally { busy = false; file.delete() }
                                }
                            }
                        }
                    }
                ) { Text(if (busy) "SPRACÚVAM…" else if (listening) "ZASTAVIŤ" else "🎤 ZAČAŤ HOVORIŤ") }
                Text("MVP: ${source.label} ↔ ${target.label}. Hlas → Gemini → preklad → hlas.")
            }
        }
    }
}

private fun startRecording(context: android.content.Context, currentRecorder: MediaRecorder?, currentFile: File?, onStarted: (MediaRecorder, File) -> Unit) {
    currentRecorder?.release(); currentFile?.delete()
    val file = File.createTempFile("fox02_", ".m4a", context.cacheDir)
    val recorder = MediaRecorder().apply {
        setAudioSource(MediaRecorder.AudioSource.MIC)
        setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
        setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
        setAudioSamplingRate(44100)
        setAudioEncodingBitRate(128000)
        setOutputFile(file.absolutePath)
        prepare(); start()
    }
    onStarted(recorder, file)
}

private data class VoiceResult(val transcript: String, val translation: String, val audio: ByteArray?)

private suspend fun translateVoice(file: File, source: String, target: String): VoiceResult = withContext(Dispatchers.IO) {
    val body = MultipartBody.Builder().setType(MultipartBody.FORM)
        .addFormDataPart("sourceLanguage", source)
        .addFormDataPart("targetLanguage", target)
        .addFormDataPart("speakResult", "true")
        .addFormDataPart("audio", file.name, file.asRequestBody("audio/mp4".toMediaType()))
        .build()
    val request = Request.Builder().url(BuildConfig.TRANSLATOR_API_URL).post(body).build()
    OkHttpClient().newCall(request).execute().use { response ->
        val payload = response.body?.string().orEmpty()
        if (!response.isSuccessful) throw IllegalStateException("HTTP ${response.code}: $payload")
        val json = JSONObject(payload)
        val audio = json.optString("audioBase64", "").takeIf { it.isNotEmpty() }?.let { Base64.getDecoder().decode(it) }
        return@withContext VoiceResult(json.getString("transcript"), json.getString("translatedText"), audio)
    }
}

private fun playAudio(audio: ByteArray) {
    val player = MediaPlayer()
    val temp = File.createTempFile("fox02_tts_", ".wav")
    temp.writeBytes(audio)
    player.setDataSource(temp.absolutePath)
    player.setOnPreparedListener { it.start() }
    player.setOnCompletionListener { it.release(); temp.delete() }
    player.prepareAsync()
}
