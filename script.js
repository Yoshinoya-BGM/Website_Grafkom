import * as THREE from 'three';

// 1. Inisialisasi Dasar
const scene = new THREE.Scene();
const canvas = document.getElementById('webgl-canvas');

// Kamera (Perspective Camera cocok untuk 3D)
const camera = new THREE.PerspectiveCamera(
    75, // Field of View (sudut pandang)
    window.innerWidth / window.innerHeight, // Aspect Ratio (sesuaikan dengan ukuran window)
    0.1, // Near clipping plane (objek terdekat yang terlihat)
    1000 // Far clipping plane (objek terjauh yang terlihat)
);
camera.position.z = 3; // Posisikan kamera sedikit ke belakang agar kubus terlihat

// Renderer (menggunakan WebGL)
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Tingkatkan kualitas render di layar HiDPI

// 2. Membuat Kubus dengan Tekstur

// Texture Loader (untuk memuat gambar 'B.jpeg')
const textureLoader = new THREE.TextureLoader();
const cubeTexture = textureLoader.load(
    'B.jpeg', // Path ke file gambar Anda
    // --- Optional Callbacks ---
    (texture) => {
        console.log('Tekstur berhasil dimuat:', texture);
        // Anda bisa melakukan sesuatu setelah tekstur dimuat,
        // misalnya mengatur wrapping atau filtering jika perlu
        texture.wrapS = THREE.RepeatWrapping; // Contoh: mengulang tekstur jika UV > 1
        texture.wrapT = THREE.RepeatWrapping;
    },
    undefined, // Callback onProgress (biasanya tidak perlu untuk satu gambar)
    (error) => {
        console.error('Gagal memuat tekstur:', error);
        // Tampilkan pesan error jika gambar tidak ditemukan atau gagal dimuat
        // Mungkin ganti material ke warna solid sebagai fallback
        cube.material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Merah sebagai tanda error
    }
);

// Geometry (bentuk dasar kubus)
const geometry = new THREE.BoxGeometry(1, 1, 1); // Ukuran sisi kubus (lebar, tinggi, kedalaman)

// Material (bagaimana permukaan objek terlihat)
// MeshBasicMaterial tidak terpengaruh oleh cahaya
const material = new THREE.MeshBasicMaterial({
    map: cubeTexture // Terapkan tekstur yang sudah dimuat
});

// Mesh (kombinasi geometry dan material)
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Tambahkan kubus ke scene

// 3. Responsif terhadap Ukuran Window
window.addEventListener('resize', () => {
    // Update ukuran renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update aspect ratio kamera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Penting setelah mengubah properti kamera
});

// 4. Animation Loop (untuk merender dan menggerakkan objek)
function animate() {
    requestAnimationFrame(animate); // Minta browser untuk memanggil fungsi ini lagi di frame berikutnya

    // Animasi sederhana: putar kubus
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    // Render scene dari sudut pandang kamera
    renderer.render(scene, camera);
}

// Mulai loop animasi
animate();