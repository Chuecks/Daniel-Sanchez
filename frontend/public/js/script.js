document.addEventListener('DOMContentLoaded', function() {
    // Para la barra de navegación
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    
    // Scroll suave para los enlaces del menú
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Inicializar el mapa con nueva vista y límites
    const map = L.map('worldMap', {
        center: [0, 0],
        zoom: 2,
        minZoom: 2,
        maxBounds: [
            [-90, -180], // Esquina suroeste
            [90, 180]    // Esquina noreste
        ]
    });
    
    // Ajustar los límites de vista para incluir la Antártida
    map.setMaxBounds([
        [-90, -180], // Incluye la Antártida
        [90, 180]
    ]);

    // Agregar capa de mapa base con límites extendidos
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        noWrap: true,
        bounds: [
            [-90, -180],
            [90, 180]
        ]
    }).addTo(map);

    // Lista de países visitados con su información
    const paisesVisitados = [
        {
            nombre: 'Uruguay',
            codigo: 'URY',
            fechaVisita: '1970-2024',
            info: 'País de origen y servicio principal'
        },
        {
            nombre: 'Argentina',
            codigo: 'ARG',
            fechaVisita: '1990',
            info: 'Misión diplomática'
        }
        // ... añade más países aquí
    ];

    // Cargar los datos GeoJSON de los países
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => response.json())
        .then(data => {
            // Crear un objeto para búsqueda rápida de información
            const paisesInfo = {};
            paisesVisitados.forEach(pais => {
                paisesInfo[pais.codigo] = pais;
            });

            // Agregar la capa GeoJSON
            L.geoJSON(data, {
                style: function(feature) {
                    // Si el país está en la lista de visitados, pintarlo de rojo
                    if (paisesInfo[feature.properties.ISO_A3]) {
                        return {
                            fillColor: '#ff0000',
                            weight: 1,
                            opacity: 1,
                            color: '#666',
                            fillOpacity: 0.7
                        };
                    }
                    // Si no está visitado, mantenerlo transparente
                    return {
                        fillColor: '#cccccc',
                        weight: 1,
                        opacity: 1,
                        color: '#666',
                        fillOpacity: 0.1
                    };
                },
                onEachFeature: function(feature, layer) {
                    const pais = paisesInfo[feature.properties.ISO_A3];
                    if (pais) {
                        layer.bindPopup(`
                            <h3>${pais.nombre}</h3>
                            <p><strong>Fecha de visita:</strong> ${pais.fechaVisita}</p>
                            <p><strong>Información:</strong> ${pais.info}</p>
                        `);
                    }
                }
            }).addTo(map);
        });

    // Inicializar el carrusel
    const carousel = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;

    // Función para mostrar el slide actual
    function showSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;
    }

    // Event listeners para los botones
    prevButton.addEventListener('click', () => {
        showSlide(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        showSlide(currentIndex + 1);
    });

    // Mostrar el primer slide
    showSlide(0);

    // Nuevo event listener para navegación suave
    const contactoLink = document.querySelector('a[href="#seccion-contacto"]');
    if (contactoLink) {
        contactoLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#seccion-contacto').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Event listener para el formulario de contacto
    const formularioContacto = document.getElementById('formularioContacto');
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const nombre = document.getElementById('contactoNombre').value;
            const email = document.getElementById('contactoEmail').value;
            const mensaje = document.getElementById('contactoComentario').value;

            try {
                const response = await fetch('http://localhost:3000/enviar-mensaje', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre,
                        email,
                        mensaje
                    })
                });

                if (response.ok) {
                    alert('Mensaje enviado exitosamente');
                    document.getElementById('formularioContacto').reset();
                } else {
                    throw new Error('Error al enviar mensaje');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al enviar mensaje');
            }
        });
    }
});

function mostrarHistoriaCompleta(id) {
    const historias = {
        congo: {
            titulo: "Apretón en el Congo",
            fecha: "1960",
            ubicacion: "Congo",
            imagen: "/imagenes/WhatsApp Image 2025-01-30 at 02.57.53.jpeg",
            contenido: `
                Durante una misión de paz en el Congo, un malentendido con la población local 
                casi termina en tragedia. Un grupo de civiles enojados, confundiendo nuestra 
                unidad con fuerzas hostiles, nos rodeó en lo que parecía ser una situación sin 
                salida.

                La tensión era palpable mientras la multitud se acercaba cada vez más, con 
                expresiones de ira y desconfianza en sus rostros. Fue gracias a la intervención 
                de un intérprete local y la calma mantenida por nuestro equipo que pudimos 
                explicar nuestra presencia y misión pacífica.

                Este incidente nos enseñó la importancia vital de la comunicación clara y el 
                entendimiento cultural en las misiones de paz. Lo que pudo haber terminado en 
                violencia, se convirtió en una oportunidad para construir puentes con la 
                comunidad local.
            `
        }
        // Puedes agregar más historias aquí
    };

    const historia = historias[id];
    if (historia) {
        const modal = document.createElement('div');
        modal.className = 'historia-modal';
        modal.innerHTML = `
            <div class="historia-modal-content">
                <button class="historia-modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
                <h2>${historia.titulo}</h2>
                <div class="historia-metadata">
                    <span class="fecha">Fecha: ${historia.fecha}</span>
                    <span class="ubicacion">Ubicación: ${historia.ubicacion}</span>
                </div>
                <img src="${historia.imagen}" alt="${historia.titulo}">
                <div class="historia-contenido-completo">
                    ${historia.contenido}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Función para mostrar detalles de la foto
function mostrarDetallesFoto(lugar) {
    const detallesFotos = {
        africa: {
            titulo: "Misión en África",
            fecha: "1995",
            ubicacion: "Congo",
            descripcion: "Durante mi servicio en la misión de paz de la ONU en África, tuve la oportunidad de trabajar con comunidades locales y otros contingentes internacionales. Esta foto fue tomada durante una operación de asistencia humanitaria.",
            imagen: "/images/WhatsApp Image 2025-01-30 at 02.57.54 (1).jpeg"
        },
        antartida: {
            titulo: "Base Antártica",
            fecha: "2001",
            ubicacion: "Antártida",
            descripcion: "Participé en una misión de investigación y apoyo logístico en la base antártica. Las condiciones extremas y el aislamiento fueron un desafío único en mi carrera.",
            imagen: "/imagenes/WhatsApp Image 2025-01-30 at 02.57.53 (1).jpeg"
        },
        pacifico: {
            titulo: "Operación Pacífico Sur",
            fecha: "2005",
            ubicacion: "Océano Pacífico",
            descripcion: "Durante esta misión naval, participamos en ejercicios multinacionales y operaciones de vigilancia marítima en el Pacífico Sur.",
            imagen: "/imagenes/WhatsApp Image 2025-01-30 at 02.57.54 (2).jpeg"
        }
    };

    const detalle = detallesFotos[lugar];
    const modal = document.createElement('div');
    modal.className = 'foto-modal';
    modal.innerHTML = `
        <div class="foto-modal-content">
            <button class="foto-modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <img src="${detalle.imagen}" alt="${detalle.titulo}">
            <h2>${detalle.titulo}</h2>
            <p><strong>Fecha:</strong> ${detalle.fecha}</p>
            <p><strong>Ubicación:</strong> ${detalle.ubicacion}</p>
            <p>${detalle.descripcion}</p>
        </div>
    `;
    document.body.appendChild(modal);
}

let enviando = false;  // Variable para controlar el estado de envío

async function enviarMensaje(event) {
    event.preventDefault();
    
    // Si ya está enviando, no hacer nada
    if (enviando) return;
    
    // Marcar como enviando
    enviando = true;
    
    // Deshabilitar el botón
    const boton = document.querySelector('button[type="submit"]');
    boton.disabled = true;

    try {
        const nombre = document.getElementById('contactoNombre').value;
        const email = document.getElementById('contactoEmail').value;
        const mensaje = document.getElementById('contactoComentario').value;

        const respuesta = await fetch('http://localhost:3000/enviar-mensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                email,
                mensaje
            })
        });

        const datos = await respuesta.json();
        
        if (respuesta.ok) {
            // Limpiar el formulario antes de mostrar la alerta
            document.getElementById('formularioContacto').reset();
            alert('Mensaje enviado exitosamente');
            
            // Redirigir o recargar después de un breve delay
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            throw new Error(datos.error || 'Error al enviar mensaje');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar mensaje: ' + error.message);
    } finally {
        // Restablecer el estado y habilitar el botón
        enviando = false;
        boton.disabled = false;
    }
}