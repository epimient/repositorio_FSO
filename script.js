document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración de Google Sheets ---
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_CIlCf-ldLinYHWZZOSaImmn2J64Rs5fhR7s1aNcyve9zDkf2ntB65YS5HqDe6VgN/exec';

    // --- Datos de las Prácticas ---
    let todasLasPracticas = [];

    // --- Referencias al DOM ---
    const practicasGrid = document.getElementById('practicas-grid');
    const searchBox = document.getElementById('search-box');
    const categoryList = document.getElementById('category-list');
    const practicaModal = document.getElementById('practicaModal');

    const modalTitle = document.getElementById('practicaModalLabel');
    const modalBigTitle = document.getElementById('modal-big-title');
    const modalObjectiveText = document.getElementById('modal-objective-text');
    const previewContainer = document.getElementById('preview-container');

    const ratingStarsContainer = document.getElementById('rating-stars');
    const commentBox = document.getElementById('comment-box');
    const nameBox = document.getElementById('name-box');
    const courseBox = document.getElementById('course-box');
    const saveFeedbackBtn = document.getElementById('save-feedback-btn');
    const feedbackStatus = document.getElementById('feedback-status');

    let currentPracticaId = null;
    let currentRating = 0;

    // --- Lógica de Renderizado ---
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
                        <div class="mt-2 text-end">
                            <span class="badge ${practica.categoria === 'linux' ? 'bg-primary' : 'bg-success'}">
                                ${practica.categoria.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            `;
            practicasGrid.appendChild(card);
        });
    };

    const filtrarPracticas = () => {
        const texto = searchBox.value.toLowerCase();
        const cat = categoryList.querySelector('.active').getAttribute('data-category');
        let filtradas = todasLasPracticas;
        if (cat !== 'all') filtradas = filtradas.filter(p => p.categoria === cat);
        if (texto) filtradas = filtradas.filter(p => p.titulo.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto));
        renderPracticas(filtradas);
    };

    searchBox.addEventListener('input', filtrarPracticas);
    categoryList.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            categoryList.querySelector('.active').classList.remove('active');
            link.classList.add('active');
            filtrarPracticas();
        }
    });

    // --- Comunicación con Google Sheets ---
    const enviarComentario = async (data) => {
        feedbackStatus.textContent = 'Enviando...';
        saveFeedbackBtn.disabled = true;
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            feedbackStatus.textContent = '¡Gracias por tu opinión!';
            feedbackStatus.style.color = 'green';
            setTimeout(() => {
                nameBox.value = '';
                courseBox.value = '';
                commentBox.value = '';
                renderStars(0);
                feedbackStatus.textContent = '';
                saveFeedbackBtn.disabled = false;
            }, 2000);
        } catch (error) {
            feedbackStatus.textContent = 'Error al enviar.';
            feedbackStatus.style.color = 'red';
            saveFeedbackBtn.disabled = false;
        }
    };

    const inicializarApp = async () => {
        practicasGrid.innerHTML = '<div class="col-12 text-center my-5"><div class="spinner-border text-primary"></div></div>';
        try {
            const resp = await fetch(`${GOOGLE_SCRIPT_URL}?type=practicas`);
            const json = await resp.json();
            if (json.status === 'success') {
                todasLasPracticas = json.data.map(p => {
                    const n = {};
                    Object.keys(p).forEach(k => n[k.toLowerCase().trim()] = p[k]);
                    return {
                        id: (n.id || '').toString(),
                        titulo: n.titulo || n['título'] || '',
                        descripcion: n.descripcion || n['descripción'] || '',
                        categoria: (n.categoria || n['categoría'] || '').toLowerCase(),
                        archivo: (n.archivo || '').toString().trim(),
                        objetivo: n.objetivo || ''
                    };
                });
                renderPracticas(todasLasPracticas);
            }
        } catch (e) {
            console.error("Error detallado de conexión:", e);
            practicasGrid.innerHTML = `
                <div class="col-12 text-center text-danger">
                    <p><i class="bi bi-exclamsion-triangle"></i> Error de conexión con Google Sheets.</p>
                    <small>${e.message}</small><br>
                    <button class="btn btn-sm btn-outline-secondary mt-2" onclick="location.reload()">Reintentar</button>
                </div>`;
        }
    };

    // --- Modal y Estrellas ---
    const renderStars = (rating) => {
        ratingStarsContainer.innerHTML = '';
        currentRating = rating;
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `bi bi-star-fill cursor-pointer mx-1 ${i <= rating ? 'text-warning' : 'text-muted'}`;
            star.onclick = () => renderStars(i);
            ratingStarsContainer.appendChild(star);
        }
    };

    practicaModal.addEventListener('show.bs.modal', (e) => {
        const id = e.relatedTarget.getAttribute('data-practica-id');
        const p = todasLasPracticas.find(item => item.id === id);
        currentPracticaId = id;

        modalTitle.textContent = p.titulo;
        modalBigTitle.textContent = p.titulo;
        modalObjectiveText.textContent = p.objetivo || 'Objetivo no disponible.';

        const isErr = p.archivo === 'Link' || !p.archivo.startsWith('http');
        previewContainer.innerHTML = isErr
            ? '<div class="alert alert-warning h-100 d-flex align-items-center justify-content-center m-0">⚠️ Link inválido en el Sheet.</div>'
            : `<iframe src="${p.archivo}" frameborder="0" style="width:100%; height:100%;"></iframe>`;

        const link = document.getElementById('open-practica-link');
        link.href = isErr ? '#' : p.archivo;
        link.onclick = (event) => { if (isErr) { event.preventDefault(); alert('Link inválido.'); } };

        // Reset
        nameBox.value = '';
        courseBox.value = '';
        commentBox.value = '';
        feedbackStatus.textContent = '';
        renderStars(0);
    });

    saveFeedbackBtn.addEventListener('click', () => {
        if (!nameBox.value.trim() || !courseBox.value.trim() || currentRating === 0) {
            feedbackStatus.textContent = 'Completa todos los campos.';
            feedbackStatus.style.color = 'red';
            return;
        }
        enviarComentario({
            practicaId: currentPracticaId,
            name: nameBox.value.trim(),
            course: courseBox.value.trim(),
            rating: currentRating,
            comment: commentBox.value.trim(),
            timestamp: new Date().toISOString()
        });
    });

    inicializarApp();
});