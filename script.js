document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración de Firebase ---
    const firebaseConfig = {
        apiKey: "AIzaSyAp50oQ1AKD6Rya40UtlPSpGwte_YY_FJ0",
        authDomain: "plataformaestudiantes-8683c.firebaseapp.com",
        databaseURL: "https://plataformaestudiantes-8683c-default-rtdb.firebaseio.com",
        projectId: "plataformaestudiantes-8683c",
        storageBucket: "plataformaestudiantes-8683c.firebasestorage.app",
        messagingSenderId: "920087087316",
        appId: "1:920087087316:web:52a720c4f1ff335b5cd341"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // --- Datos de las Prácticas ---
    const todasLasPracticas = [
        { id: 'practica1', titulo: 'Explorando el Pasado Digital', descripcion: 'Comprender la evolución de los sistemas operativos desde MS-DOS hasta Windows 10/11.', archivo: 'https://docs.google.com/document/d/e/2PACX-1vR87qa1mi0XYb2_KH2hshQRDkati1KfBOOJ6jIGR3_IC_o0Vx_ferD74nWX23uzY0UNAFhF-2nUnIxq/pub?embedded=true', categoria: 'windows' },
        { id: 'practica2', titulo: 'Instalación de Sistemas Operativos Linux en VirtualBox', descripcion: 'Familiarizarse con la instalación de Ubuntu Desktop, Ubuntu Server y Arch Linux.', archivo: 'https://docs.google.com/document/d/e/2PACX-1vSu-6joYzXWFIF6fzVIrKR5cOnhsqAaCDLTuvcToDs61LeSQlPLAVYtDc5ekQSg4txY1bAPGj3Yn0AH/pub?embedded=true', categoria: 'linux' },
        { id: 'practica3', titulo: 'Instalación de Paquetes y Entornos Gráficos', descripcion: 'Aprender a instalar software y personalizar Arch y Ubuntu para distintos propósitos.', archivo: 'https://docs.google.com/document/d/e/2PACX-1vSTEmF9EcmC4Au4v1wIcXv1T23_NEeQRRzQ0RxOJZ6DGrbwTfVEuU-WBSvew2CYJdkt5EAcOvX3qtKl/pub?embedded=true', categoria: 'linux' },
        { id: 'practica4', titulo: 'Configuración de servidores en Ubuntu (CLI)', descripcion: 'Desarrollar habilidades en la configuración de servicios como web, DNS, FTP o SSH.', archivo: 'https://docs.google.com/document/d/e/2PACX-1vSEExMC71_kG-PLTUiBEo_CNucGEGUdAiEJ3FcxhSFH6SdC30BkM1rp8ts_nTi10H8TIFrZKdYJKk9d/pub?embedded=true', categoria: 'linux' }
    ];

    // --- Referencias a Elementos del DOM ---
    const practicasGrid = document.getElementById('practicas-grid');
    const searchBox = document.getElementById('search-box');
    const categoryList = document.getElementById('category-list');
    const practicaModal = document.getElementById('practicaModal');
    const modalTitle = document.getElementById('practicaModalLabel');
    const modalBody = practicaModal.querySelector('.modal-body');
    const ratingStarsContainer = document.getElementById('rating-stars');
    const commentBox = document.getElementById('comment-box');
    const nameBox = document.getElementById('name-box');
    const courseBox = document.getElementById('course-box');
    const commentsList = document.getElementById('comments-list');
    const saveFeedbackBtn = document.getElementById('save-feedback-btn');
    const feedbackStatus = document.getElementById('feedback-status');

    let currentPracticaId = null;
    let currentRating = 0;

    // --- Lógica de Renderizado y Filtro ---
    const renderPracticas = (practicas) => {
        practicasGrid.innerHTML = '';
        if (practicas.length === 0) {
            practicasGrid.innerHTML = '<p class="col-12 text-center text-muted">No se encontraron prácticas.</p>';
            return;
        }
        practicas.forEach(practica => {
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';
            card.innerHTML = `
                <div class="card h-100" data-bs-toggle="modal" data-bs-target="#practicaModal" data-practica-id="${practica.id}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${practica.titulo}</h5>
                        <p class="card-text flex-grow-1">${practica.descripcion}</p>
                        <span class="badge ${practica.categoria === 'linux' ? 'bg-primary' : 'bg-success'}">${practica.categoria.charAt(0).toUpperCase() + practica.categoria.slice(1)}</span>
                    </div>
                </div>
            `;
            practicasGrid.appendChild(card);
        });
    };

    const filtrarPracticas = () => {
        const textoBusqueda = searchBox.value.toLowerCase();
        const categoriaActiva = categoryList.querySelector('.active').getAttribute('data-category');
        let practicasFiltradas = todasLasPracticas;
        if (categoriaActiva !== 'all') {
            practicasFiltradas = practicasFiltradas.filter(p => p.categoria === categoriaActiva);
        }
        if (textoBusqueda) {
            practicasFiltradas = practicasFiltradas.filter(p => p.titulo.toLowerCase().includes(textoBusqueda) || p.descripcion.toLowerCase().includes(textoBusqueda));
        }
        renderPracticas(practicasFiltradas);
    };

    searchBox.addEventListener('input', filtrarPracticas);
    categoryList.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
            e.preventDefault();
            categoryList.querySelector('.active').classList.remove('active');
            e.target.closest('a').classList.add('active');
            filtrarPracticas();
        }
    });

    // --- Lógica del Modal y Firebase ---
    practicaModal.addEventListener('show.bs.modal', (event) => {
        const card = event.relatedTarget;
        currentPracticaId = card.getAttribute('data-practica-id');
        const practica = todasLasPracticas.find(p => p.id === currentPracticaId);

        modalTitle.textContent = practica.titulo;
        modalBody.innerHTML = `<iframe src="${practica.archivo}" frameborder="0" style="width: 100%; height: 80vh;">Cargando...</iframe>`;

        // Configurar el enlace para abrir en nueva pestaña
        const openPracticaLink = document.getElementById('open-practica-link');
        openPracticaLink.href = practica.archivo;

        // Resetear estado del formulario de feedback
        commentBox.value = '';
        nameBox.value = '';
        courseBox.value = '';
        feedbackStatus.textContent = '';
        saveFeedbackBtn.disabled = false;
        renderStars(0); // Renderiza las estrellas para el *nuevo* feedback
        commentsList.innerHTML = '<p class="text-muted">Cargando opiniones...</p>';

        // Cargar y mostrar todos los feedbacks de Firebase
        const feedbackRef = database.ref('feedback/' + currentPracticaId);
        feedbackRef.orderByChild('timestamp').on('value', (snapshot) => {
            commentsList.innerHTML = ''; // Limpiar la lista antes de renderizar
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const feedback = childSnapshot.val();
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('border-bottom', 'pb-2', 'mb-2');

                    // Crear HTML para las estrellas de cada comentario guardado
                    let starsHTML = '';
                    for (let i = 1; i <= 5; i++) {
                        starsHTML += `<i class="bi bi-star-fill ${i <= feedback.rating ? 'text-warning' : 'text-muted'}"></i>`;
                    }

                    commentElement.innerHTML = `
                        <p class="mb-0">
                            <strong>${feedback.name || 'Anónimo'}</strong>
                            <span class="text-muted">- ${feedback.course || 'Sin curso'}</span>
                        </p>
                        <p class="mb-1">${feedback.comment}</p>
                        <div>${starsHTML}</div>
                        <small class="text-muted">${new Date(feedback.timestamp).toLocaleString()}</small>
                    `;
                    commentsList.prepend(commentElement); // Usar prepend para mostrar los más nuevos primero
                });
            } else {
                commentsList.innerHTML = '<p class="text-muted">Aún no hay opiniones. ¡Sé el primero!</p>';
            }
        });
    });

    // Lógica de las estrellas
    const renderStars = (rating) => {
        ratingStarsContainer.innerHTML = '';
        currentRating = rating;
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `bi bi-star-fill star ${i <= rating ? 'filled' : ''}`;
            star.dataset.value = i;
            ratingStarsContainer.appendChild(star);
        }
    };

    ratingStarsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.value);
            renderStars(rating);
        }
    });

    // Guardar feedback en Firebase
    saveFeedbackBtn.addEventListener('click', () => {
        console.log('Botón de guardar presionado.');
        console.log('Rating actual:', currentRating);
        console.log('Nombre:', nameBox.value);
        console.log('Curso:', courseBox.value);

        // Validación más robusta
        if (!nameBox.value.trim() || !courseBox.value.trim() || currentRating === 0) {
            feedbackStatus.textContent = 'Debes rellenar nombre, curso y dar una calificación.';
            feedbackStatus.style.color = 'red'; // Hacer el mensaje más visible
            console.error('Validación fallida: Faltan campos.');
            return;
        }

        const feedbackData = {
            name: nameBox.value.trim(),
            course: courseBox.value.trim(),
            rating: currentRating,
            comment: commentBox.value.trim(),
            timestamp: new Date().toISOString()
        };

        feedbackStatus.textContent = 'Guardando...';
        feedbackStatus.style.color = '#6c757d'; // Color por defecto de text-muted
        saveFeedbackBtn.disabled = true;
        console.log('Enviando a Firebase:', feedbackData);

        // Usar push() para crear un ID único para cada opinión
        database.ref('feedback/' + currentPracticaId).push(feedbackData)
            .then(() => {
                feedbackStatus.textContent = '¡Opinión guardada con éxito!';
                feedbackStatus.style.color = 'green';
                console.log('¡Éxito! Feedback guardado.');
                // Limpiar campos después de guardar
                nameBox.value = '';
                courseBox.value = '';
                commentBox.value = '';
                renderStars(0);
                setTimeout(() => {
                    feedbackStatus.textContent = '';
                }, 4000);
            })
            .catch((error) => {
                feedbackStatus.textContent = 'Error al guardar. Revisa las reglas de la BD.';
                feedbackStatus.style.color = 'red';
                console.error('Error de Firebase:', error);
            })
            .finally(() => {
                saveFeedbackBtn.disabled = false;
            });
    });

    // Carga inicial de las prácticas
    renderPracticas(todasLasPracticas);
});