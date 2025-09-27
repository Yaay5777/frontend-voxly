// Fragment shader for 3D audio visualization
precision mediump float;

uniform float time;
uniform float audioData;
uniform vec3 color;
uniform vec2 resolution;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying float vAudioData;

void main() {
    // Audio-reactive color mixing
    vec3 baseColor = color;
    vec3 audioColor = vec3(0.5 + 0.5 * sin(time + vPosition.x), 
                          0.5 + 0.5 * cos(time + vPosition.y), 
                          0.5 + 0.5 * sin(time + vPosition.z));
    
    // Mix colors based on audio data
    vec3 finalColor = mix(baseColor, audioColor, vAudioData * 0.7);
    
    // Add fresnel effect
    float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);
    finalColor += fresnel * audioColor * 0.3;
    
    // Add pulsing effect based on audio
    float pulse = 0.8 + 0.2 * sin(time * 5.0) * vAudioData;
    finalColor *= pulse;
    
    gl_FragColor = vec4(finalColor, 0.9);
}
