// Curated "designed" gradients — fixed Figma-exported compositions of blurred
// blobs. Unlike the parametric `svgPaths` system, these are select-and-use
// presets stored as raw SVG strings. To add more, paste a new object below.

export type GradientCategory = {
  id: string
  label: string
}

export type LibraryGradient = {
  id: string
  name: string
  categoryId: string
  // Raw SVG markup. IDs are namespaced per-instance at render time to avoid
  // collisions when several of these render on the same page (Figma reuses
  // ids like `filter0_f_8_124`).
  svg: string
}

// Tabs shown in the library dialog. "All" is prepended by the UI.
export const gradientCategories: GradientCategory[] = [
  { id: "light", label: "Light Gradients" },
  { id: "svg", label: "SVG Backgrounds" },
]

export const libraryGradients: LibraryGradient[] = [
  {
    id: "light-1",
    name: "Aurora",
    categoryId: "light",
    svg: `<svg width="1440" height="900" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_8_124)">
<rect width="1440" height="900" fill="#FBF4F4"/>
<g filter="url(#filter0_f_8_124)">
<path d="M1375.42 282.166C1465.26 303.232 1471.64 212.682 1543.64 200.26C1799.44 156.129 1823.7 771.906 1560.5 864.741C1311.5 952.571 1055.03 447.583 1055.03 447.583C1055.03 447.583 1005.46 313.793 1055.03 259.682C1099.76 210.848 1158.09 213.213 1222.05 230.372C1272.58 243.929 1324.48 270.221 1375.42 282.166Z" fill="#7F30FF"/>
</g>
<g filter="url(#filter1_f_8_124)">
<path d="M1200.03 527.948C1332.28 558.973 1341.67 425.622 1447.66 407.328C1824.19 342.338 1859.9 1249.18 1472.48 1385.89C1105.94 1515.24 728.425 771.555 728.425 771.555C728.425 771.555 655.469 574.525 728.425 494.837C794.266 422.92 880.127 426.404 974.276 451.674C1048.66 471.638 1125.05 510.358 1200.03 527.948Z" fill="#00B0FF"/>
</g>
<g filter="url(#filter2_f_8_124)">
<ellipse cx="889.5" cy="1069" rx="446.5" ry="446" fill="#0038FF"/>
</g>
<g filter="url(#filter3_f_8_124)">
<path d="M167.094 875.621C117.064 1025.21 95.1738 1139.2 167.094 1279.57C307.314 1553.22 809.482 1551.06 953.832 1279.57C1067.92 1064.98 901.364 892.508 780.13 681.882C726.637 588.944 712.765 511.496 619.009 459.567C409.208 343.364 243.217 648.017 167.094 875.621Z" fill="#FF4880"/>
</g>
<g filter="url(#filter4_f_8_124)">
<ellipse cx="87" cy="1128.5" rx="356" ry="355.5" fill="#FF8000"/>
</g>
</g>
<defs>
<filter id="filter0_f_8_124" x="533" y="-302" width="1714" height="1677" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_8_124"/>
</filter>
<filter id="filter1_f_8_124" x="196" y="-96" width="2051" height="1997" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_8_124"/>
</filter>
<filter id="filter2_f_8_124" x="-57" y="123" width="1893" height="1892" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_8_124"/>
</filter>
<filter id="filter3_f_8_124" x="-379" y="-66" width="1871" height="2050" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_8_124"/>
</filter>
<filter id="filter4_f_8_124" x="-769" y="273" width="1712" height="1711" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_8_124"/>
</filter>
<clipPath id="clip0_8_124">
<rect width="1440" height="900" fill="white"/>
</clipPath>
</defs>
</svg>`,
  },
  {
    id: "light-svg-2",
    name: "Twilight",
    categoryId: "svg",
    svg: `<svg width="1468" height="1052" viewBox="0 0 1468 1052" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g filter="url(#filter0_d_2300_1588)">
<g clip-path="url(#clip0_2300_1588)">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="black"/>
<mask id="mask0_2300_1588" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="-281" y="-558" width="2323" height="2323">
<g opacity="0.1">
<rect x="-280.806" y="718.672" width="1804.8" height="1479.72" transform="rotate(-45 -280.806 718.672)" fill="url(#pattern0_2300_1588)"/>
</g>
</mask>
<g mask="url(#mask0_2300_1588)">
<g filter="url(#filter1_f_2300_1588)">
<ellipse cx="1578.08" cy="-126.299" rx="408.224" ry="443.789" transform="rotate(45 1578.08 -126.299)" fill="#2388FF"/>
</g>
<g opacity="0.3" filter="url(#filter2_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<rect width="176.97" height="1253.56" transform="matrix(0.724596 0.689174 -0.691922 0.721972 1344.89 -180.977)" fill="url(#paint0_linear_2300_1588)"/>
</g>
<g opacity="0.8" filter="url(#filter3_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<rect width="176.965" height="1253.59" transform="matrix(0.695489 0.718537 -0.716815 0.697263 1443.48 -87.6934)" fill="url(#paint1_linear_2300_1588)"/>
</g>
</g>
<g filter="url(#filter4_f_2300_1588)">
<ellipse cx="1578.08" cy="-126.299" rx="408.224" ry="443.789" transform="rotate(45 1578.08 -126.299)" fill="#2388FF"/>
</g>
<g opacity="0.3" filter="url(#filter5_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<rect width="176.97" height="1253.56" transform="matrix(0.724596 0.689174 -0.691922 0.721972 1344.89 -180.977)" fill="url(#paint2_linear_2300_1588)"/>
</g>
<g opacity="0.8" filter="url(#filter6_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<rect width="176.965" height="1253.59" transform="matrix(0.695489 0.718537 -0.716815 0.697263 1443.48 -87.6936)" fill="url(#paint3_linear_2300_1588)"/>
</g>
<g opacity="0.8" filter="url(#filter7_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<path d="M1541.14 39.376L944.059 636.455" stroke="url(#paint4_linear_2300_1588)" stroke-width="5.29972"/>
</g>
<g opacity="0.8" filter="url(#filter8_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<path d="M1338.36 -104.143L741.28 492.936" stroke="url(#paint5_linear_2300_1588)" stroke-width="5.29972"/>
</g>
<g opacity="0.8" filter="url(#filter9_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<path d="M1327.38 82.3694L880.383 529.368" stroke="url(#paint6_linear_2300_1588)" stroke-width="1.32493"/>
</g>
<g opacity="0.3" filter="url(#filter10_f_2300_1588)">
<g filter="url(#filter11_f_2300_1588)">
<ellipse cx="1105.93" cy="-246.169" rx="408.224" ry="474.439" transform="rotate(45 1105.93 -246.169)" fill="#2388FF"/>
</g>
<g opacity="0.3" filter="url(#filter12_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<path d="M866.581 -294.683L995.03 -172.936L66.4561 793.308L-61.9922 671.561L866.581 -294.683Z" fill="url(#paint7_linear_2300_1588)"/>
</g>
<g opacity="0.8" filter="url(#filter13_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<rect width="176.969" height="1340.16" transform="matrix(0.69468 0.719319 -0.716192 0.697903 965.358 -201.583)" fill="url(#paint8_linear_2300_1588)"/>
</g>
</g>
<g opacity="0.3" filter="url(#filter14_f_2300_1588)">
<g filter="url(#filter15_f_2300_1588)">
<ellipse cx="612.082" cy="-282.04" rx="408.224" ry="391.759" transform="rotate(45 612.082 -282.04)" fill="#2388FF"/>
</g>
<g opacity="0.8" filter="url(#filter16_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<rect width="176.958" height="1106.67" transform="matrix(0.72257 0.691298 -0.689882 0.723922 389.359 -347.182)" fill="url(#paint9_linear_2300_1588)"/>
</g>
<g opacity="0.8" filter="url(#filter17_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<rect width="176.96" height="1106.65" transform="matrix(0.69686 0.717207 -0.718094 0.695946 487.641 -253.587)" fill="url(#paint10_linear_2300_1588)"/>
</g>
</g>
<g opacity="0.4" filter="url(#filter18_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<ellipse cx="369.196" cy="221.975" rx="61.0936" ry="620.018" transform="rotate(45 369.196 221.975)" fill="url(#paint11_linear_2300_1588)"/>
</g>
<g opacity="0.4" filter="url(#filter19_f_2300_1588)" style="mix-blend-mode:plus-lighter">
<ellipse cx="845.534" cy="135.575" rx="61.0936" ry="620.018" transform="rotate(45 845.534 135.575)" fill="url(#paint12_linear_2300_1588)"/>
</g>
</g>
<path d="M54 10.5H1414C1435.82 10.5 1453.5 28.1848 1453.5 50V994C1453.5 1015.82 1435.82 1033.5 1414 1033.5H54C32.1848 1033.5 14.5 1015.82 14.5 994V50C14.5 28.1848 32.1848 10.5 54 10.5Z" stroke="black" stroke-opacity="0.75"/>
</g>
<defs>
<filter id="filter0_d_2300_1588" x="0" y="0" width="1468" height="1052" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2300_1588"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2300_1588" result="shape"/>
</filter>
<pattern id="pattern0_2300_1588" patternContentUnits="objectBoundingBox" width="0.277039" height="0.405483">
<use xlink:href="#image0_2300_1588" transform="scale(0.000277039 0.000337903)"/>
</pattern>
<filter id="filter1_f_2300_1588" x="886.71" y="-817.665" width="1382.73" height="1382.73" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="132.493" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter2_f_2300_1588" x="446.916" y="-211.583" width="1056.81" height="1088.21" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15.3029" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter3_f_2300_1588" x="490.832" y="-141.751" width="1129.79" height="1109.35" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="27.0286" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter4_f_2300_1588" x="886.71" y="-817.665" width="1382.73" height="1382.73" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="132.493" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter5_f_2300_1588" x="446.916" y="-211.583" width="1056.81" height="1088.21" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15.3029" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter6_f_2300_1588" x="490.832" y="-141.751" width="1129.79" height="1109.35" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="27.0286" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter7_f_2300_1588" x="916.385" y="11.7022" width="652.427" height="652.427" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="12.9" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter8_f_2300_1588" x="713.607" y="-131.817" width="652.427" height="652.427" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="12.9" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter9_f_2300_1588" x="854.115" y="56.1009" width="499.536" height="499.536" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="12.9" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter10_f_2300_1588" x="-93.8922" y="-720.649" width="1674.3" height="1613.56" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15.95" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter11_f_2300_1588" x="398.367" y="-953.735" width="1415.13" height="1415.13" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="132.493" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter12_f_2300_1588" x="-91.9922" y="-324.683" width="1117.02" height="1147.99" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter13_f_2300_1588" x="-50.451" y="-257.583" width="1194.75" height="1174.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="28" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter14_f_2300_1588" x="-406.01" y="-714.016" width="1450.07" height="1389.42" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15.95" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter15_f_2300_1588" x="-49.995" y="-944.116" width="1324.15" height="1324.15" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="131" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter16_f_2300_1588" x="-454.11" y="-427.182" width="1051.33" height="1083.47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="40" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter17_f_2300_1588" x="-387.038" y="-333.587" width="1078" height="1057.09" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="40" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter18_f_2300_1588" x="-171.379" y="-318.6" width="1081.15" height="1081.15" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<filter id="filter19_f_2300_1588" x="358.959" y="-350.999" width="973.149" height="973.149" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="23" result="effect1_foregroundBlur_2300_1588"/>
</filter>
<linearGradient id="paint0_linear_2300_1588" x1="114.652" y1="0" x2="114.652" y2="1253.56" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.8" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint1_linear_2300_1588" x1="88.4826" y1="0" x2="88.4826" y2="1253.59" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint2_linear_2300_1588" x1="114.652" y1="0" x2="114.652" y2="1253.56" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.8" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint3_linear_2300_1588" x1="88.4826" y1="0" x2="88.4826" y2="1253.59" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint4_linear_2300_1588" x1="1541.49" y1="39.7295" x2="944.412" y2="636.809" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.796199" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint5_linear_2300_1588" x1="1338.71" y1="-103.79" x2="741.634" y2="493.29" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.796199" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint6_linear_2300_1588" x1="1327.74" y1="82.7229" x2="880.737" y2="529.722" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.796199" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint7_linear_2300_1588" x1="930.805" y1="-233.81" x2="8.94401" y2="738.796" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint8_linear_2300_1588" x1="88.4843" y1="0" x2="88.4843" y2="1340.16" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint9_linear_2300_1588" x1="111.615" y1="-430.227" x2="103.297" y2="1106.75" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.802306" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint10_linear_2300_1588" x1="111.617" y1="-430.221" x2="103.299" y2="1106.73" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.802306" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint11_linear_2300_1588" x1="385.171" y1="-880.12" x2="370.046" y2="842" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.802306" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint12_linear_2300_1588" x1="861.509" y1="-966.519" x2="846.384" y2="755.601" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.802306" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<clipPath id="clip0_2300_1588">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="white"/>
</clipPath>
<image id="image0_2300_1588" width="1000" height="1200" preserveAspectRatio="none" xlink:href="data:image/png;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOX0FAAAAGFUBAAAAxgk6AAAALCDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOd39BQAAABhVAQAAAMYJOgAAACwg6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADzl9BQAAABhVAQAAAMYJOgAAACwg6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADznd/QUAAAAYVQEAAADGCToAAAAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA85fQUAAAAYVQEAAADGCToAAAAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA853f0FAAAAGFUBAAAAxgk6AAAALCDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOX0FAAAAGFUBAAAAxgk6AAAALCDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOd39BQAAABhVAQAAAMYJOgAAACwg6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADzl9BQAAABhVAQAAAMYJOgAAACwg6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADznd/QUAAAAYVQEAAADGCToAAAAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA85fQUAAAAYVQEAAADGCToAAAAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA853f0FAAAAGFUBAAAAxgk6AAAALCDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOX0FAAAAGFUBAAAAxgk6AAAALCDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOd39BQAAABhVAQAAAMYJOgAAACwg6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADzl9BQAAABhVAQAAAMYJOgAAACwg6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADznd/QUAAAAYVQEAAADGCToAAAAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA85fQUAAAAYVQEAAADGCToAAAAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA853f0FAAAAGFUBAAAAxgk6AAAALCDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOX0FAAAAGFUBAAAAxgk6AAAALCDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOd39BQAAABhVAQAAAMYJOgAAACwg6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8iD8E7W3tHgtM7QAAAABJRU5ErkJggg=="/>
</defs>
</svg>`,
  },
  {
    id: "light-svg-3",
    name: "Coral",
    categoryId: "svg",
    svg: `<svg width="1468" height="1052" viewBox="0 0 1468 1052" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_2300_2569)">
<g clip-path="url(#clip0_2300_2569)">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="black"/>
<g opacity="0.48" filter="url(#filter1_f_2300_2569)" style="mix-blend-mode:plus-lighter">
<ellipse cx="731.975" cy="-65.1104" rx="521.689" ry="343.206" fill="#2388FF"/>
</g>
<g opacity="0.48" filter="url(#filter2_f_2300_2569)" style="mix-blend-mode:plus-lighter">
<ellipse cx="731.975" cy="-177.074" rx="521.689" ry="260.377" fill="#4A3AFF"/>
</g>
<g opacity="0.8" filter="url(#filter3_f_2300_2569)" style="mix-blend-mode:plus-lighter">
<path d="M584.557 -128.883H880.985L835.303 1145.3H653.944L584.557 -128.883Z" fill="url(#paint0_linear_2300_2569)"/>
</g>
<g opacity="0.3" filter="url(#filter4_f_2300_2569)" style="mix-blend-mode:plus-lighter">
<rect width="296.265" height="1255.29" transform="matrix(0.999696 0.0246429 -0.0648799 0.997893 346.763 -495.784)" fill="url(#paint1_linear_2300_2569)"/>
</g>
<g opacity="0.3" filter="url(#filter5_f_2300_2569)" style="mix-blend-mode:plus-lighter">
<rect width="296.265" height="1255.29" transform="matrix(-0.999696 0.0246429 0.0648799 0.997893 1151.74 -480.372)" fill="url(#paint2_linear_2300_2569)"/>
</g>
<g opacity="0.3" filter="url(#filter6_f_2300_2569)">
<path d="M344.648 -392.872L640.991 -397.305L685.61 855.975L389.267 860.408L344.648 -392.872Z" fill="url(#paint3_linear_2300_2569)"/>
</g>
<g opacity="0.3" filter="url(#filter7_f_2300_2569)">
<path d="M835.387 -397.305L1131.35 -386.644L1024.03 865.039L728.069 854.377L835.387 -397.305Z" fill="url(#paint4_linear_2300_2569)"/>
</g>
</g>
<path d="M54 10.5H1414C1435.82 10.5 1453.5 28.1848 1453.5 50V994C1453.5 1015.82 1435.82 1033.5 1414 1033.5H54C32.1848 1033.5 14.5 1015.82 14.5 994V50C14.5 28.1848 32.1848 10.5 54 10.5Z" stroke="black" stroke-opacity="0.75"/>
</g>
<defs>
<filter id="filter0_d_2300_2569" x="0" y="0" width="1468" height="1052" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2300_2569"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2300_2569" result="shape"/>
</filter>
<filter id="filter1_f_2300_2569" x="-89.7139" y="-708.316" width="1643.38" height="1286.41" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_2300_2569"/>
</filter>
<filter id="filter2_f_2300_2569" x="10.2864" y="-637.452" width="1443.38" height="920.754" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2300_2569"/>
</filter>
<filter id="filter3_f_2300_2569" x="490.557" y="-222.883" width="484.428" height="1462.19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="47" result="effect1_foregroundBlur_2300_2569"/>
</filter>
<filter id="filter4_f_2300_2569" x="173.42" y="-587.684" width="561.419" height="1443.75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="45.95" result="effect1_foregroundBlur_2300_2569"/>
</filter>
<filter id="filter5_f_2300_2569" x="763.664" y="-572.272" width="561.419" height="1443.75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="45.95" result="effect1_foregroundBlur_2300_2569"/>
</filter>
<filter id="filter6_f_2300_2569" x="314.648" y="-427.305" width="400.961" height="1317.71" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur_2300_2569"/>
</filter>
<filter id="filter7_f_2300_2569" x="698.069" y="-427.305" width="463.282" height="1322.34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur_2300_2569"/>
</filter>
<linearGradient id="paint0_linear_2300_2569" x1="732.771" y1="-128.883" x2="732.771" y2="1145.3" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint1_linear_2300_2569" x1="148.133" y1="0" x2="148.133" y2="1255.29" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint2_linear_2300_2569" x1="148.133" y1="0" x2="148.133" y2="1255.29" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint3_linear_2300_2569" x1="536.637" y1="-395.744" x2="555.389" y2="857.923" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.8" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint4_linear_2300_2569" x1="1027.13" y1="-390.398" x2="981.961" y2="863.523" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.8" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<clipPath id="clip0_2300_2569">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="white"/>
</clipPath>
</defs>
</svg>`,
  },
  {
    id: "light-svg-4",
    name: "Marine",
    categoryId: "svg",
    svg: `<svg width="1468" height="1052" viewBox="0 0 1468 1052" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_2300_1543)">
<g clip-path="url(#clip0_2300_1543)">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="black"/>
<g filter="url(#filter1_f_2300_1543)">
<path d="M1794.37 -393.512C1794.37 -41.6765 3787.83 430.045 1680.57 430.045C-426.692 430.045 1738.77 -41.6765 1738.77 -393.512C1738.77 -745.348 -432.966 -1058.7 1674.29 -1058.7C3781.55 -1058.7 1794.37 -745.348 1794.37 -393.512Z" fill="#2388FF"/>
</g>
<g filter="url(#filter2_f_2300_1543)" style="mix-blend-mode:lighten">
<path d="M1805.61 -913.853C1805.61 -392.007 2707.93 307.656 1686.14 307.656C664.344 307.656 1704.86 -392.007 1704.86 -913.853C1704.86 -1435.7 -63.4969 -1900.46 1680.94 -1900.46C3425.38 -1900.46 1805.61 -1435.7 1805.61 -913.853Z" fill="#2388FF"/>
</g>
<g filter="url(#filter3_f_2300_1543)" style="mix-blend-mode:plus-lighter">
<path d="M1805.61 -1130.96C1805.61 -609.115 2326.53 90.5476 1686.14 90.5476C1045.74 90.5476 1704.86 -609.115 1704.86 -1130.96C1704.86 -1652.81 -63.4969 -2117.57 1680.94 -2117.57C3425.38 -2117.57 1805.61 -1652.81 1805.61 -1130.96Z" fill="white"/>
</g>
</g>
<path d="M54 10.5H1414C1435.82 10.5 1453.5 28.1848 1453.5 50V994C1453.5 1015.82 1435.82 1033.5 1414 1033.5H54C32.1848 1033.5 14.5 1015.82 14.5 994V50C14.5 28.1848 32.1848 10.5 54 10.5Z" stroke="black" stroke-opacity="0.75"/>
</g>
<defs>
<filter id="filter0_d_2300_1543" x="0" y="0" width="1468" height="1052" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2300_1543"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2300_1543" result="shape"/>
</filter>
<filter id="filter1_f_2300_1543" x="349.251" y="-1463.61" width="2703.23" height="2298.57" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="202.456" result="effect1_foregroundBlur_2300_1543"/>
</filter>
<filter id="filter2_f_2300_1543" x="634.408" y="-2177.84" width="2132.92" height="2762.88" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="138.69" result="effect1_foregroundBlur_2300_1543"/>
</filter>
<filter id="filter3_f_2300_1543" x="634.408" y="-2394.95" width="2132.92" height="2762.88" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="138.69" result="effect1_foregroundBlur_2300_1543"/>
</filter>
<clipPath id="clip0_2300_1543">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="white"/>
</clipPath>
</defs>
</svg>`,
  },
  {
    id: "light-svg-5",
    name: "Ember",
    categoryId: "svg",
    svg: `<svg width="1468" height="1052" viewBox="0 0 1468 1052" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_2300_2587)">
<g clip-path="url(#clip0_2300_2587)">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="black"/>
<g filter="url(#filter1_f_2300_2587)">
<path d="M751.737 31.2415L810.198 323.596C836.015 452.706 903.584 569.738 1002.49 656.651L1226.44 853.457L751.737 692.851L277.031 853.457L500.988 656.651C599.891 569.738 667.46 452.706 693.277 323.597L751.737 31.2415Z" fill="#2388FF"/>
</g>
<g opacity="0.4" filter="url(#filter2_f_2300_2587)">
<path d="M751.737 -42.0356L827.713 337.91C853.53 467.019 921.099 584.052 1020 670.965L1311.06 926.734L751.737 737.501L192.418 926.734L483.473 670.965C582.376 584.052 649.945 467.019 675.762 337.91L751.737 -42.0356Z" fill="#2388FF"/>
</g>
<g filter="url(#filter3_f_2300_2587)" style="mix-blend-mode:plus-lighter">
<ellipse cx="751.737" cy="789.56" rx="267.912" ry="189.309" fill="#4A3AFF"/>
</g>
<g filter="url(#filter4_f_2300_2587)" style="mix-blend-mode:plus-lighter">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1386.44 757.235C1259.75 704.052 1022.91 668.269 751.649 668.269C480.388 668.269 243.552 704.052 116.855 757.236C236.386 700.42 475.796 661.644 751.649 661.644C1027.5 661.644 1266.91 700.419 1386.44 757.235Z" fill="#2388FF"/>
</g>
<g filter="url(#filter5_f_2300_2587)" style="mix-blend-mode:plus-lighter">
<path d="M1386.44 757.236C1259.75 704.052 1022.91 668.27 751.649 668.27C480.388 668.27 243.552 704.052 116.855 757.236C236.386 700.42 475.796 645.678 751.649 645.678C1027.5 645.678 1266.91 700.42 1386.44 757.236Z" fill="#4A3AFF"/>
</g>
<path d="M1484.45 846.177C1484.45 901.076 1604.75 1039.11 1443.76 1071.74C1316.62 1097.51 890.565 1071.74 711.98 1071.74C551.317 1071.74 210.114 1081.66 89.3346 1060.38C-94.1328 1028.04 14.3744 913.341 18.8495 846.177C18.8495 747.921 346.935 668.27 751.649 668.27C1156.36 668.27 1484.45 747.921 1484.45 846.177Z" fill="black"/>
</g>
<path d="M54 10.5H1414C1435.82 10.5 1453.5 28.1848 1453.5 50V994C1453.5 1015.82 1435.82 1033.5 1414 1033.5H54C32.1848 1033.5 14.5 1015.82 14.5 994V50C14.5 28.1848 32.1848 10.5 54 10.5Z" stroke="black" stroke-opacity="0.75"/>
</g>
<defs>
<filter id="filter0_d_2300_2587" x="0" y="0" width="1468" height="1052" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2300_2587"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2300_2587" result="shape"/>
</filter>
<filter id="filter1_f_2300_2587" x="77.031" y="-168.759" width="1349.41" height="1222.22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2300_2587"/>
</filter>
<filter id="filter2_f_2300_2587" x="-7.58203" y="-242.036" width="1518.64" height="1368.77" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2300_2587"/>
</filter>
<filter id="filter3_f_2300_2587" x="253.125" y="369.55" width="997.224" height="840.018" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="115.35" result="effect1_foregroundBlur_2300_2587"/>
</filter>
<filter id="filter4_f_2300_2587" x="108.555" y="653.344" width="1286.19" height="112.192" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="4.15" result="effect1_foregroundBlur_2300_2587"/>
</filter>
<filter id="filter5_f_2300_2587" x="52.4547" y="581.278" width="1398.39" height="240.358" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="32.2" result="effect1_foregroundBlur_2300_2587"/>
</filter>
<clipPath id="clip0_2300_2587">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="white"/>
</clipPath>
</defs>
</svg>`,
  },
  {
    id: "light-svg-8",
    name: "Bloom",
    categoryId: "svg",
    svg: `<svg width="1468" height="1052" viewBox="0 0 1468 1052" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_2300_2632)">
<g clip-path="url(#clip0_2300_2632)">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="black"/>
<g opacity="0.4" filter="url(#filter1_f_2300_2632)">
<ellipse cx="420.574" cy="358.073" rx="420.574" ry="358.073" transform="matrix(-1 8.74228e-08 8.74228e-08 1 1154.57 -291.003)" fill="url(#paint0_linear_2300_2632)"/>
</g>
<g opacity="0.6" filter="url(#filter2_f_2300_2632)" style="mix-blend-mode:plus-lighter">
<path d="M441.991 98.4748C624.831 378.425 705.227 766.804 722.57 926C703.246 374.904 360.234 -204.511 191.143 -425.332C198.576 -367.376 259.151 -181.476 441.991 98.4748Z" fill="url(#paint1_linear_2300_2632)"/>
</g>
<g opacity="0.6" filter="url(#filter3_f_2300_2632)" style="mix-blend-mode:plus-lighter">
<path d="M1026.01 98.4747C843.169 378.425 762.773 766.804 745.43 926C764.754 374.904 1107.77 -204.511 1276.86 -425.332C1269.42 -367.376 1208.85 -181.476 1026.01 98.4747Z" fill="url(#paint2_linear_2300_2632)"/>
</g>
<g opacity="0.3" filter="url(#filter4_f_2300_2632)">
<path d="M698.092 796.061C693.161 650.247 668.948 287.387 611.547 2.45826C647.546 101.474 715.254 398.817 698.092 796.061Z" fill="url(#paint3_linear_2300_2632)"/>
</g>
<g opacity="0.3" filter="url(#filter5_f_2300_2632)">
<path d="M769.908 796.061C774.839 650.247 799.052 287.387 856.453 2.45824C820.454 101.474 752.746 398.817 769.908 796.061Z" fill="url(#paint4_linear_2300_2632)"/>
</g>
<g opacity="0.6" filter="url(#filter6_f_2300_2632)">
<path d="M679.598 598.198C638.421 400.335 498.963 -8.50838 270.543 -60.9857C393.333 -148.447 647.05 -139.056 679.598 598.198Z" fill="url(#paint5_linear_2300_2632)"/>
</g>
<g opacity="0.6" filter="url(#filter7_f_2300_2632)">
<path d="M788.402 598.198C829.579 400.335 969.037 -8.50841 1197.46 -60.9858C1074.67 -148.447 820.95 -139.056 788.402 598.198Z" fill="url(#paint6_linear_2300_2632)"/>
</g>
<g filter="url(#filter8_f_2300_2632)" style="mix-blend-mode:screen">
<path d="M734 812.259C734.141 814.268 734.279 816.276 734.413 818.282C734.66 809.498 735.099 799.991 735.721 789.836C764.526 443.103 895.173 73.0328 936.53 -7.99786C944.25 -14.4344 951.946 -35.761 959.57 -35.761L508.43 -35.7609C516.054 -35.7609 523.75 -14.4343 531.469 -7.99782C572.827 73.0328 703.474 443.103 732.279 789.836C732.901 799.991 733.34 809.498 733.587 818.282C733.721 816.276 733.859 814.268 734 812.259Z" fill="url(#paint7_linear_2300_2632)"/>
</g>
<g filter="url(#filter9_f_2300_2632)" style="mix-blend-mode:plus-lighter">
<ellipse cx="225.57" cy="100.198" rx="225.57" ry="100.198" transform="matrix(-1 8.74228e-08 8.74228e-08 1 959.57 -142.347)" fill="#4A3AFF"/>
</g>
<g opacity="0.6" filter="url(#filter10_f_2300_2632)" style="mix-blend-mode:plus-lighter">
<ellipse cx="734" cy="-25.906" rx="463.457" ry="170.798" transform="rotate(-180 734 -25.906)" fill="url(#paint8_radial_2300_2632)"/>
</g>
<g filter="url(#filter11_f_2300_2632)" style="mix-blend-mode:plus-lighter">
<ellipse cx="734" cy="-25.906" rx="213.896" ry="78.8273" transform="rotate(-180 734 -25.906)" fill="url(#paint9_radial_2300_2632)"/>
</g>
</g>
<path d="M54 10.5H1414C1435.82 10.5 1453.5 28.1848 1453.5 50V994C1453.5 1015.82 1435.82 1033.5 1414 1033.5H54C32.1848 1033.5 14.5 1015.82 14.5 994V50C14.5 28.1848 32.1848 10.5 54 10.5Z" stroke="black" stroke-opacity="0.75"/>
</g>
<defs>
<filter id="filter0_d_2300_2632" x="0" y="0" width="1468" height="1052" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2300_2632"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2300_2632" result="shape"/>
</filter>
<filter id="filter1_f_2300_2632" x="-99.5737" y="-704.003" width="1667.15" height="1542.15" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="206.5" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter2_f_2300_2632" x="146.443" y="-470.032" width="620.827" height="1440.73" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="22.35" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter3_f_2300_2632" x="700.73" y="-470.032" width="620.827" height="1440.73" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="22.35" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter4_f_2300_2632" x="583.746" y="-25.3417" width="144.884" height="849.203" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="13.9" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter5_f_2300_2632" x="739.37" y="-25.3417" width="144.884" height="849.203" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="13.9" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter6_f_2300_2632" x="198.643" y="-170.463" width="552.855" height="840.561" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="35.95" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter7_f_2300_2632" x="716.502" y="-170.463" width="552.855" height="840.561" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="35.95" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter8_f_2300_2632" x="454.63" y="-89.561" width="558.74" height="961.644" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="26.9" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter9_f_2300_2632" x="283.13" y="-367.647" width="901.74" height="650.996" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="112.65" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter10_f_2300_2632" x="70.543" y="-396.704" width="1326.91" height="741.596" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<filter id="filter11_f_2300_2632" x="320.104" y="-304.733" width="827.793" height="557.655" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2300_2632"/>
</filter>
<linearGradient id="paint0_linear_2300_2632" x1="420.574" y1="105.144" x2="420.574" y2="872.299" gradientUnits="userSpaceOnUse">
<stop stop-color="#4A3AFF"/>
<stop offset="1" stop-color="#2388FF"/>
</linearGradient>
<linearGradient id="paint1_linear_2300_2632" x1="456.857" y1="-425.332" x2="456.857" y2="926" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#4A3AFF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint2_linear_2300_2632" x1="1011.14" y1="-425.332" x2="1011.14" y2="926" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#4A3AFF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint3_linear_2300_2632" x1="656.188" y1="2.45826" x2="656.188" y2="796.061" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#4A3AFF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint4_linear_2300_2632" x1="811.812" y1="2.45825" x2="811.812" y2="796.061" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#4A3AFF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint5_linear_2300_2632" x1="475.07" y1="-98.5627" x2="475.07" y2="598.198" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#4A3AFF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint6_linear_2300_2632" x1="992.93" y1="-98.5628" x2="992.93" y2="598.198" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#4A3AFF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint7_linear_2300_2632" x1="734" y1="-17.8636" x2="734" y2="818.283" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#4A3AFF" stop-opacity="0"/>
</linearGradient>
<radialGradient id="paint8_radial_2300_2632" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(734 -25.906) rotate(-90) scale(170.798 463.457)">
<stop offset="0.11" stop-color="#2388FF"/>
<stop offset="1" stop-color="#4A3AFF"/>
</radialGradient>
<radialGradient id="paint9_radial_2300_2632" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(734 -25.906) rotate(-90) scale(78.8273 213.896)">
<stop offset="0.11" stop-color="#2388FF"/>
<stop offset="1" stop-color="#4A3AFF"/>
</radialGradient>
<clipPath id="clip0_2300_2632">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="white"/>
</clipPath>
</defs>
</svg>`,
  },
  {
    id: "light-svg-9",
    name: "Nebula",
    categoryId: "svg",
    svg: `<svg width="1468" height="1052" viewBox="0 0 1468 1052" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g filter="url(#filter0_d_2300_2974)">
<g clip-path="url(#clip0_2300_2974)">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="black"/>
<mask id="mask0_2300_2974" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="14" y="10" width="1440" height="1024">
<rect x="14" y="10" width="1440" height="1024" fill="url(#pattern0_2300_2974)"/>
</mask>
<g mask="url(#mask0_2300_2974)">
<g opacity="0.3" filter="url(#filter1_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M-296.3 -29.3818L-158.109 -167.573L779.608 770.143L641.416 908.334L-296.3 -29.3818Z" fill="url(#paint0_linear_2300_2974)"/>
</g>
<g opacity="0.3" filter="url(#filter2_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M-129.128 -196.554L9.06385 -334.746L733.356 389.546L595.164 527.738L-129.128 -196.554Z" fill="url(#paint1_linear_2300_2974)"/>
</g>
<g opacity="0.8" filter="url(#filter3_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M-227.204 -98.4775L-89.0127 -236.669L542.299 394.642L404.107 532.834L-227.204 -98.4775Z" fill="url(#paint2_linear_2300_2974)"/>
</g>
<g opacity="0.3" filter="url(#filter4_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M516.139 -269.696L581.189 -334.746L1212.5 296.566L1147.45 361.616L516.139 -269.696Z" fill="url(#paint3_linear_2300_2974)"/>
</g>
<g opacity="0.3" filter="url(#filter5_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M787.706 -145.935L830.983 -189.212L1462.29 442.099L1419.02 485.376L787.706 -145.935Z" fill="url(#paint4_linear_2300_2974)"/>
</g>
</g>
<g filter="url(#filter6_f_2300_2974)">
<circle cx="-199.57" cy="-238.016" r="300" transform="rotate(-45 -199.57 -238.016)" fill="#2388FF"/>
</g>
<g opacity="0.3" filter="url(#filter7_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M-296.3 -29.3818L-158.109 -167.573L779.608 770.143L641.416 908.334L-296.3 -29.3818Z" fill="url(#paint5_linear_2300_2974)"/>
</g>
<g opacity="0.3" filter="url(#filter8_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M-129.128 -196.554L9.06385 -334.746L733.356 389.546L595.164 527.738L-129.128 -196.554Z" fill="url(#paint6_linear_2300_2974)"/>
</g>
<g opacity="0.8" filter="url(#filter9_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M-227.204 -98.4775L-89.0127 -236.669L542.299 394.642L404.107 532.834L-227.204 -98.4775Z" fill="url(#paint7_linear_2300_2974)"/>
</g>
<g opacity="0.3" filter="url(#filter10_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M516.139 -269.696L581.189 -334.746L1212.5 296.566L1147.45 361.616L516.139 -269.696Z" fill="url(#paint8_linear_2300_2974)"/>
</g>
<g opacity="0.3" filter="url(#filter11_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<path d="M787.706 -145.935L830.983 -189.212L1462.29 442.099L1419.02 485.376L787.706 -145.935Z" fill="url(#paint9_linear_2300_2974)"/>
</g>
<g opacity="0.94" filter="url(#filter12_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<circle cx="417.013" cy="315.836" r="300" transform="rotate(-45 417.013 315.836)" fill="#2388FF"/>
</g>
<g opacity="0.56" filter="url(#filter13_f_2300_2974)" style="mix-blend-mode:plus-lighter">
<circle cx="591.56" cy="281.332" r="221.857" transform="rotate(-45 591.56 281.332)" fill="#2388FF"/>
</g>
</g>
<path d="M54 10.5H1414C1435.82 10.5 1453.5 28.1848 1453.5 50V994C1453.5 1015.82 1435.82 1033.5 1414 1033.5H54C32.1848 1033.5 14.5 1015.82 14.5 994V50C14.5 28.1848 32.1848 10.5 54 10.5Z" stroke="black" stroke-opacity="0.75"/>
</g>
<defs>
<filter id="filter0_d_2300_2974" x="0" y="0" width="1468" height="1052" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2300_2974"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2300_2974" result="shape"/>
</filter>
<pattern id="pattern0_2300_2974" patternContentUnits="objectBoundingBox" width="0.415972" height="0.585937">
<use xlink:href="#image0_2300_2974" transform="scale(0.000347222 0.000488281)"/>
</pattern>
<filter id="filter1_f_2300_2974" x="-327.3" y="-198.573" width="1137.91" height="1137.91" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15.5" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter2_f_2300_2974" x="-160.128" y="-365.746" width="924.483" height="924.483" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15.5" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter3_f_2300_2974" x="-281.204" y="-290.669" width="877.503" height="877.503" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter4_f_2300_2974" x="462.139" y="-388.746" width="804.361" height="804.361" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter5_f_2300_2974" x="733.706" y="-243.212" width="782.589" height="782.589" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter6_f_2300_2974" x="-764.556" y="-803.002" width="1129.97" height="1129.97" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="132.493" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter7_f_2300_2974" x="-327.3" y="-198.573" width="1137.91" height="1137.91" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15.5" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter8_f_2300_2974" x="-160.128" y="-365.746" width="924.483" height="924.483" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="15.5" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter9_f_2300_2974" x="-281.204" y="-290.669" width="877.503" height="877.503" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter10_f_2300_2974" x="462.139" y="-388.746" width="804.361" height="804.361" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter11_f_2300_2974" x="733.706" y="-243.212" width="782.589" height="782.589" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter12_f_2300_2974" x="-162.987" y="-264.164" width="1160" height="1160" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="140" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<filter id="filter13_f_2300_2974" x="69.703" y="-240.525" width="1043.71" height="1043.71" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_2300_2974"/>
</filter>
<linearGradient id="paint0_linear_2300_2974" x1="-206.771" y1="-118.911" x2="730.945" y2="818.806" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.8" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint1_linear_2300_2974" x1="-39.599" y1="-286.083" x2="684.693" y2="438.209" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.8" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint2_linear_2300_2974" x1="-158.108" y1="-167.573" x2="473.203" y2="463.738" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint3_linear_2300_2974" x1="548.664" y1="-302.221" x2="1179.97" y2="329.091" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint4_linear_2300_2974" x1="809.344" y1="-167.574" x2="1440.66" y2="463.738" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint5_linear_2300_2974" x1="-206.771" y1="-118.911" x2="730.945" y2="818.806" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.8" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint6_linear_2300_2974" x1="-39.599" y1="-286.083" x2="684.693" y2="438.209" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.8" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint7_linear_2300_2974" x1="-158.108" y1="-167.573" x2="473.203" y2="463.738" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint8_linear_2300_2974" x1="548.664" y1="-302.221" x2="1179.97" y2="329.091" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint9_linear_2300_2974" x1="809.344" y1="-167.574" x2="1440.66" y2="463.738" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="0.88" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<clipPath id="clip0_2300_2974">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="white"/>
</clipPath>
<image id="image0_2300_2974" width="1198" height="1200" preserveAspectRatio="none" xlink:href="data:image/png;base64,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PvL09fX19fX19fX19fX19fX19fVPVIerpmk+zp2VRew1kvT19fX19fX19fX19fX19fX19fdUh6t5nh9ifxWbSvgxkvT19fX19fX19fX19fX19fX19fdUh6vtVvftdvfy9vAVLCvZ2zVulNfXjyR9fX19fX19fX19fX19fX19AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2NZd8aRzHm67rXtZ1vS0f+/I6LMvyNAzDZ1yBvr6+vr6+vr6+vr6+vr6+vr7+T9Xhaou2bft+DH43lfhd9s/r60eCvn4k6OtHgr5+JOjrR4K+fiTo60eCvn4k/LXfRkWJPu9EN/22kkWSvr6+vr6+vr6+vr6+vr6+vr7+7u+i7v7cwfHRrix9fX19fX19fX19fX19fX19ff0TlwxX0y9nfeTp6+vr6+vr6+vr6+vr6+vr6+ufqA5XTdN8nDsri9hrJOnr6+vr6+vr6+vr6+vr6+vr6++pDlfzPD/E/io2lfBjJOnr6+vr6+vr6+vr6+vr6+vr6++pDlfbre7b7e7l7eErWFayt2vcKK+vH0n6+vr6+vr6+vr6+vr6+vr6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADsay750jiON13Xvazrels+9uV1WJblaRiGz7gCfX19fX19fX19fX19fX19fX39n6rD1RZt2/b9GPxuKvG77J/X148Eff1I0NePBH39SNDXjwR9/UjQ148Eff1I+Gu/jYoSfd6JbvptJYskfX19fX19fX19fX19fX19fX393d9F3f25g+OjXVn6+vr6+vr6+vr6+vr6+vr6+vonLhmupl/O+sjT19fX19fX19fX19fX19fX19c/UR2umqb5OHdWFrHXSNLX19fX19fX19fX19fX19fX199THa7meX6I/VVsKuHHSNLX19fX19fX19fX19fX19fX199THa62W923293L28NXsKxkb9e4UV5fP5L09fX19fX19fX19fX19fX1AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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"/>
</defs>
</svg>`,
  },
  {
    id: "light-svg-11",
    name: "Prism",
    categoryId: "svg",
    svg: `<svg width="1468" height="1052" viewBox="0 0 1468 1052" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g filter="url(#filter0_d_2300_1897)">
<g clip-path="url(#clip0_2300_1897)">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="black"/>
<mask id="mask0_2300_1897" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="-371" y="-582" width="2170" height="2289">
<g opacity="0.04">
<rect x="1798.23" y="-132.549" width="1903.51" height="1735.6" transform="rotate(105 1798.23 -132.549)" fill="url(#pattern0_2300_1897)"/>
</g>
</mask>
<g mask="url(#mask0_2300_1897)">
<g filter="url(#filter1_f_2300_1897)" style="mix-blend-mode:plus-lighter">
<path d="M-1047.65 2210.43C313.351 1710.81 710.548 -235.211 739.021 -1145.77C767.495 -235.211 1164.69 1710.81 2525.69 2210.43H-1047.65Z" fill="url(#paint0_linear_2300_1897)"/>
</g>
</g>
<g filter="url(#filter2_f_2300_1897)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M-123.223 692.802C351.119 -458.854 536.618 -1703.12 561.325 -2493.26H906.675C931.383 -1703.12 1116.88 -458.854 1591.22 692.802C2066.63 1847.05 2819.07 2878.19 3959.32 3296.78L3899.79 3631.71H-2431.79L-2491.32 3296.78C-1351.07 2878.19 -598.634 1847.05 -123.223 692.802ZM-1695.99 3286.19H3163.99C2273.8 2720.07 1670.09 1791.54 1271.74 824.389C1019.84 212.797 846.619 -422.138 734 -1006.71C621.381 -422.138 448.159 212.797 196.258 824.389C-202.092 1791.54 -805.803 2720.07 -1695.99 3286.19Z" fill="url(#paint1_linear_2300_1897)" fill-opacity="0.12"/>
</g>
<g filter="url(#filter3_f_2300_1897)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M54.671 667.158C430.576 -245.503 577.579 -1231.55 597.159 -1857.72H870.841C890.421 -1231.55 1037.42 -245.503 1413.33 667.158C1790.08 1581.87 2386.37 2399.03 3289.99 2730.75L3242.81 2996.17H-1774.81L-1821.99 2730.75C-918.368 2399.03 -322.081 1581.87 54.671 667.158ZM-1191.71 2722.36H2659.71C1954.26 2273.72 1475.83 1537.88 1160.15 771.437C960.522 286.764 823.248 -216.406 734 -679.668C644.752 -216.406 507.478 286.764 307.852 771.437C-7.83057 1537.88 -486.258 2273.72 -1191.71 2722.36Z" fill="url(#paint2_linear_2300_1897)" fill-opacity="0.12"/>
</g>
<g filter="url(#filter4_f_2300_1897)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M250.209 638.969C517.914 -10.991 622.603 -713.217 636.548 -1159.15H831.452C845.397 -713.217 950.086 -10.991 1217.79 638.969C1486.1 1290.39 1910.75 1872.34 2554.27 2108.57L2520.67 2297.6H-1052.67L-1086.27 2108.57C-442.749 1872.34 -18.0981 1290.39 250.209 638.969ZM-637.413 2102.6H2105.41C1603.02 1783.1 1262.3 1259.06 1037.49 713.233C895.32 368.068 797.559 9.73059 734 -320.185C670.441 9.73059 572.68 368.068 430.515 713.233C205.698 1259.06 -135.018 1783.1 -637.413 2102.6Z" fill="url(#paint3_linear_2300_1897)" fill-opacity="0.12"/>
</g>
<g filter="url(#filter5_f_2300_1897)" style="mix-blend-mode:plus-lighter">
<path d="M-1052.67 2200.1C308.329 1700.48 705.527 -245.543 734 -1156.1C762.473 -245.543 1159.67 1700.48 2520.67 2200.1H-1052.67Z" fill="url(#paint4_linear_2300_1897)"/>
</g>
<g filter="url(#filter6_f_2300_1897)" style="mix-blend-mode:plus-lighter">
<path d="M-73.4434 1453.03C541.629 1136.48 721.132 -96.4501 734 -673.348C746.868 -96.4501 926.371 1136.48 1541.44 1453.03H-73.4434Z" fill="url(#paint5_linear_2300_1897)"/>
</g>
</g>
<path d="M54 10.5H1414C1435.82 10.5 1453.5 28.1848 1453.5 50V994C1453.5 1015.82 1435.82 1033.5 1414 1033.5H54C32.1848 1033.5 14.5 1015.82 14.5 994V50C14.5 28.1848 32.1848 10.5 54 10.5Z" stroke="black" stroke-opacity="0.75"/>
</g>
<defs>
<filter id="filter0_d_2300_1897" x="0" y="0" width="1468" height="1052" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2300_1897"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2300_1897" result="shape"/>
</filter>
<pattern id="pattern0_2300_1897" patternContentUnits="objectBoundingBox" width="0.262673" height="0.298456">
<use xlink:href="#image0_2300_1897" transform="scale(0.000262673 0.000288085)"/>
</pattern>
<filter id="filter1_f_2300_1897" x="-1247.65" y="-1345.77" width="3973.35" height="3756.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2300_1897"/>
</filter>
<filter id="filter2_f_2300_1897" x="-2547.32" y="-2549.26" width="6562.64" height="6236.97" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="28" result="effect1_foregroundBlur_2300_1897"/>
</filter>
<filter id="filter3_f_2300_1897" x="-1877.99" y="-1913.72" width="5223.98" height="4965.9" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="28" result="effect1_foregroundBlur_2300_1897"/>
</filter>
<filter id="filter4_f_2300_1897" x="-1142.27" y="-1215.15" width="3752.54" height="3568.75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="28" result="effect1_foregroundBlur_2300_1897"/>
</filter>
<filter id="filter5_f_2300_1897" x="-1252.67" y="-1356.1" width="3973.35" height="3756.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2300_1897"/>
</filter>
<filter id="filter6_f_2300_1897" x="-273.443" y="-873.348" width="2014.89" height="2526.37" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2300_1897"/>
</filter>
<linearGradient id="paint0_linear_2300_1897" x1="827.838" y1="-447.058" x2="368.212" y2="1152.74" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.72"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint1_linear_2300_1897" x1="734" y1="-700.527" x2="734" y2="1476.78" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint2_linear_2300_1897" x1="734" y1="-437.023" x2="734" y2="1288.44" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint3_linear_2300_1897" x1="734" y1="-147.384" x2="734" y2="1081.42" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint4_linear_2300_1897" x1="734" y1="-901.382" x2="734" y2="797.776" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint5_linear_2300_1897" x1="734" y1="-180.918" x2="734" y2="1100.65" gradientUnits="userSpaceOnUse">
<stop stop-color="#2388FF"/>
<stop offset="1" stop-color="#2388FF" stop-opacity="0"/>
</linearGradient>
<clipPath id="clip0_2300_1897">
<path d="M14 50C14 27.9086 31.9086 10 54 10H1414C1436.09 10 1454 27.9086 1454 50V994C1454 1016.09 1436.09 1034 1414 1034H54C31.9086 1034 14 1016.09 14 994V50Z" fill="white"/>
</clipPath>
<image id="image0_2300_1897" width="1000" height="1036" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAQMCAYAAAAF0bP+AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABFaSURBVHgB7ddBEcAgEASwBf8GVw010P/BTOIiCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8W21PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxotT0BAAAARu0AAAAA4wQdAAAALiDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8KDV9gQAAAAYtQMAAACME3QAAAC4gKADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAg1bbEwAAAGDUDgAAADBO0AEAAOACgg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWm1PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxotT0BAAAARu0AAAAA4wQdAAAALiDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8KDV9gQAAAAYtQMAAACME3QAAAC4gKADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAg1bbEwAAAGDUDgAAADBO0AEAAOACgg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWm1PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxotT0BAAAARu0AAAAA4wQdAAAALiDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8KDV9gQAAAAYtQMAAACME3QAAAC4gKADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAg1bbEwAAAGDUDgAAADBO0AEAAOACgg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWm1PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxotT0BAAAARu0AAAAA4wQdAAAALiDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8KDV9gQAAAAYtQMAAACME3QAAAC4gKADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAg1bbEwAAAGDUDgAAADBO0AEAAOACgg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWm1PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxotT0BAAAARu0AAAAA4wQdAAAALiDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8KDV9gQAAAAYtQMAAACME3QAAAC4gKADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAg1bbEwAAAGDUDgAAADBO0AEAAOACgg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWm1PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxotT0BAAAARu0AAAAA4wQdAAAALiDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8KDV9gQAAAAYtQMAAACME3QAAAC4gKADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAg1bbEwAAAGDUDgAAADBO0AEAAOACgg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWm1PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxotT0BAAAARu0AAAAA4wQdAAAALiDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8KDV9gQAAAAYtQMAAACME3QAAAC4gKADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAg1bbEwAAAGDUDgAAADBO0AEAAOACgg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWm1PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxotT0BAAAARu0AAAAA4wQdAAAALiDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8KDV9gQAAAAYtQMAAACME3QAAAC4gKADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAg1bbEwAAAGDUDgAAADBO0AEAAOACgg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWm1PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxotT0BAAAARu0AAAAA4wQdAAAALiDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8KDV9gQAAAAYtQMAAACME3QAAAC4gKADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAg1bbEwAAAGDUDgAAADBO0AEAAOACgg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPWm1PAAAAgFE7AAAAwDhBBwAAgAsIOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAxT5E04P2DBrh1wAAAABJRU5ErkJggg=="/>
</defs>
</svg>`,
  },
]
