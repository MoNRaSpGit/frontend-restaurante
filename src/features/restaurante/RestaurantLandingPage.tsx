const serviceCards = [
  {
    title: "Reservas sin friccion",
    text: "Una experiencia pensada para captar mesas, ordenar horarios y bajar el caos de WhatsApp."
  },
  {
    title: "Carta viva",
    text: "El menu puede evolucionar por temporada, horario o evento sin depender de piezas estaticas."
  },
  {
    title: "Operacion mas clara",
    text: "Salon, cocina y caja se leen como un mismo flujo en lugar de sistemas sueltos."
  }
];

const menuMoments = [
  {
    label: "Brunch",
    title: "Huevos benedictinos con focaccia tostada",
    detail: "Servicio agil para mesas tempranas y flujo alto."
  },
  {
    label: "Signature",
    title: "Risotto de hongos con manteca de tomillo",
    detail: "Plato emblema para una carta corta y memorable."
  },
  {
    label: "After",
    title: "Cocteleria de autor y tapas compartidas",
    detail: "Ideal para tickets medios mas altos al final del dia."
  }
];

const metrics = [
  { value: "48", label: "mesas sincronizadas" },
  { value: "12 min", label: "promedio para reasignar reserva" },
  { value: "94%", label: "ocupacion pico visible al instante" }
];

const roadmap = [
  {
    step: "01",
    title: "Frente comercial",
    text: "Primera capa visual para mostrar identidad del producto y validar interes real."
  },
  {
    step: "02",
    title: "Backoffice liviano",
    text: "Luego entrarian reservas, mesas, turnos y lectura operativa diaria."
  },
  {
    step: "03",
    title: "Flujo completo",
    text: "Mas adelante podria conectar cocina, caja, take away y delivery."
  }
];

const shiftHighlights = [
  "Vista del salon por turno",
  "Reservas y walk-ins en un mismo tablero",
  "Estado de cocina y barra",
  "Seguimiento de ticket promedio"
];

export function RestaurantLandingPage() {
  return (
    <main className="restaurant-page">
      <div className="backdrop backdrop-top" />
      <div className="backdrop backdrop-bottom" />

      <section className="hero">
        <div className="hero-copy" data-reveal="up">
          <span className="eyebrow">SaaS para restaurantes</span>
          <h1>Un modulo listo para reservas, salon y ritmo operativo real.</h1>
          <p className="hero-text">
            `frontend-restaurante` nace como una base viva para validar el producto en pantalla desde ya. La idea no es
            mostrar solo una maqueta: es abrir una experiencia que ya sugiera como podria sentirse un restaurante
            moderno operando con claridad.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#producto">
              Ver propuesta
            </a>
            <a className="button button-secondary" href="#roadmap">
              Ver roadmap
            </a>
          </div>

          <ul className="hero-list">
            {shiftHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="hero-visual" data-reveal="scale">
          <article className="hero-card hero-card-main">
            <span className="chip">Turno noche</span>
            <h2>Salon visible, cocina acompasada, reservas bajo control.</h2>
            <p>
              La interfaz propone una lectura calida pero operativa: menos planillas, menos ruido y mas foco en el
              pulso real del servicio.
            </p>
            <div className="hero-card-grid">
              <div>
                <strong>28</strong>
                <span>reservas activas</span>
              </div>
              <div>
                <strong>6</strong>
                <span>mesas por confirmar</span>
              </div>
              <div>
                <strong>3</strong>
                <span>ordenes en pase</span>
              </div>
              <div>
                <strong>1</strong>
                <span>carta del dia</span>
              </div>
            </div>
          </article>

          <article className="hero-note hero-note-left">
            <span>Flujo</span>
            <strong>Recepcion → salon → cocina → cierre</strong>
          </article>

          <article className="hero-note hero-note-right">
            <span>Listo para Pages</span>
            <strong>Deploy rapido con `npm run deploy`</strong>
          </article>
        </div>
      </section>

      <section className="metrics-band" data-reveal="up">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="section-block" id="producto">
        <div className="section-heading" data-reveal="up">
          <span className="eyebrow">Direccion del producto</span>
          <h2>El modulo arranca como vitrina viva, pero ya sugiere un sistema pensado para operar restaurante de verdad.</h2>
        </div>

        <div className="service-grid">
          {serviceCards.map((card, index) => (
            <article className="service-card" data-reveal="up" key={card.title} style={{ animationDelay: `${index * 120}ms` }}>
              <span className="service-index">0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="menu-section">
        <div className="section-heading" data-reveal="up">
          <span className="eyebrow">Escenas del menu</span>
          <h2>La experiencia visual mezcla producto, ambientacion y operacion para que el modulo no se sienta generico.</h2>
        </div>

        <div className="menu-grid">
          {menuMoments.map((item, index) => (
            <article className="menu-card" data-reveal="scale" key={item.title} style={{ animationDelay: `${index * 140}ms` }}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="roadmap">
        <article className="overview-panel" data-reveal="left">
          <span className="eyebrow">Lectura del modulo</span>
          <h2>La primera entrega prioriza identidad, claridad y una narrativa que ya invite a imaginar el uso diario.</h2>
          <p>
            La base visual ya queda lista para mostrar en vivo mientras el backend y la operacion real del producto se
            van definiendo. Eso ayuda a conversar alcance sin esperar al sistema completo.
          </p>
        </article>

        <div className="roadmap-panel" data-reveal="right">
          {roadmap.map((item) => (
            <article className="roadmap-card" key={item.step}>
              <span>{item.step}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section" data-reveal="scale">
        <div>
          <span className="eyebrow">Siguiente paso</span>
          <h2>El frontend ya queda listo para subir al repo nuevo y publicarlo en GitHub Pages apenas conectes el remoto.</h2>
        </div>
        <a className="button button-primary" href="https://github.com" target="_blank" rel="noreferrer">
          Preparar repo
        </a>
      </section>
    </main>
  );
}

