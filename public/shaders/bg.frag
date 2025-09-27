precision mediump float;
uniform vec2 u_resolution; uniform float u_time;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float v = 0.5 + 0.5 * sin(uv.x * 10.0 + u_time * 0.3);
  vec3 col = mix(vec3(0.03,0.04,0.09), vec3(0.35,0.05,0.9), v);
  gl_FragColor = vec4(col,1.0);
}
