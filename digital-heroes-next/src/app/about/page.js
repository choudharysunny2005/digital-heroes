"use client";

export default function About() {
  return (
    <div
      className="about-container"
      style={{ padding: "60px 5%", maxWidth: "1000px", margin: "0 auto" }}
    >
      <section style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
          Our Mission
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: "1.8",
            color: "var(--text-gray)",
          }}
        >
          At <strong>Digital Heroes</strong>, our mission is to empower everyday
          people with extraordinary products. We bridge the gap between premium
          quality and accessible pricing, ensuring that you don't have to
          compromise on your lifestyle.
        </p>
      </section>

      <section
        style={{
          marginTop: "50px",
          display: "flex",
          gap: "50px",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3>Our Journey</h3>
          <p style={{ marginTop: "15px" }}>
            Founded in 2023, Digital Heroes started with a simple belief:
            superior technology and fashion should be available to everyone.
            What began as a small boutique has grown into a global marketplace,
            thanks to customers who share our passion for excellence.
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
            alt="Team"
            style={{ width: "100%", borderRadius: "12px" }}
          />
        </div>
      </section>

      <section style={{ marginTop: "50px", textAlign: "center" }}>
        <h3>Global Presence</h3>
        <p style={{ marginTop: "15px" }}>
          With warehouses in over 10 countries, we ensure rapid delivery and
          local support across the globe.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              padding: "20px",
              background: "var(--primary-bg-alt)",
              borderRadius: "8px",
            }}
          >
            <h4>USA</h4>
          </div>
          <div
            style={{
              padding: "20px",
              background: "var(--primary-bg-alt)",
              borderRadius: "8px",
            }}
          >
            <h4>UK</h4>
          </div>
          <div
            style={{
              padding: "20px",
              background: "var(--primary-bg-alt)",
              borderRadius: "8px",
            }}
          >
            <h4>India</h4>
          </div>
          <div
            style={{
              padding: "20px",
              background: "var(--primary-bg-alt)",
              borderRadius: "8px",
            }}
          >
            <h4>Germany</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
