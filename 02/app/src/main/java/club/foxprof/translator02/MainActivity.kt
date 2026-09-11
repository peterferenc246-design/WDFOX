package club.foxprof.translator02

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
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

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { TranslatorScreen() }
    }
}

@Composable
fun TranslatorScreen() {
    var languageA by remember { mutableStateOf("Slovenčina") }
    var languageB by remember { mutableStateOf("Deutsch") }
    var listening by remember { mutableStateOf(false) }
    var textA by remember { mutableStateOf("") }
    var textB by remember { mutableStateOf("") }

    MaterialTheme {
        Surface(Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                Text("FOX 02", style = MaterialTheme.typography.headlineLarge)
                Text("LIVE AI TRANSLATOR", style = MaterialTheme.typography.titleMedium)

                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedButton(onClick = { val x = languageA; languageA = languageB; languageB = x }) {
                        Text("$languageA ⇄ $languageB")
                    }
                }

                Text(if (listening) "🎤 Počúvam…" else "Pripravené na rozhovor")
                Text(if (textA.isBlank()) "Ty ($languageA)" else textA)
                Text(if (textB.isBlank()) "Protistrana ($languageB)" else textB)

                Button(
                    modifier = Modifier.fillMaxWidth(),
                    onClick = { listening = !listening }
                ) {
                    Text(if (listening) "ZASTAVIŤ" else "🎤 ZAČAŤ HOVORIŤ")
                }

                Text(
                    "MVP: $languageA ↔ $languageB. Ďalší krok: Speech-to-Text, AI preklad a Text-to-Speech API."
                )
            }
        }
    }
}
