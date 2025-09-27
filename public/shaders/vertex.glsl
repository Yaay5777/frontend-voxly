// Vertex shader for 3D audio visualization
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float time;
uniform float audioData;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying float vAudioData;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vAudioData = audioData;
    
    // Audio-reactive vertex displacement
    vec3 pos = position;
    float displacement = sin(pos.y * 10.0 + time * 2.0) * audioData * 0.1;
    pos += normal * displacement;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
