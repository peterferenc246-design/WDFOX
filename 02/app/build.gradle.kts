plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "club.foxprof.translator02"
    compileSdk = 35
    buildFeatures { buildConfig = true }
    defaultConfig {
        applicationId = "club.foxprof.translator02"
        minSdk = 26
        targetSdk = 35
        versionCode = 3
        versionName = "0.3.0"
        // Android audio -> original Google Gemini speech recognition -> transcript + translation.
        buildConfigField("String", "TRANSLATOR_API_URL", "\"https://wdfox.vercel.app/api/translate-voice\"")
    }
}

kotlin { jvmToolchain(17) }

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.activity:activity-compose:1.10.0")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
}
