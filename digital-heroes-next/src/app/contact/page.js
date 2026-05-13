"use client";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="contact-container" style={{ padding: "60px 5%" }}>
      <header style={{ textAlign: "center", marginBottom: "60px" }}>
        <h2 style={{ fontSize: "3rem", fontWeight: 800 }}>Get In Touch</h2>
        <p
          style={{
            color: "var(--text-gray)",
            fontSize: "1.2rem",
            maxWidth: "600px",
            margin: "20px auto 0 auto",
          }}
        >
          Have questions about an order or a specific product? Our team of
          digital heroes is here to help!
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "50px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "var(--primary-bg-alt)",
            padding: "40px",
            borderRadius: "15px",
          }}
        >
          <h3>Send Us A Message</h3>
          <form
            style={{
              marginTop: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Your Name"
              style={{
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <input
              type="email"
              placeholder="Your Email"
              style={{
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              style={{
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            ></textarea>
            <button
              className="cta-button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "var(--accent-color)",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mail size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Email Us</h4>
              <p style={{ margin: "5px 0 0 0", color: "var(--text-gray)" }}>
                support@digitalheroes.com
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "var(--accent-color)",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Phone size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Call Us</h4>
              <p style={{ margin: "5px 0 0 0", color: "var(--text-gray)" }}>
                +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "var(--accent-color)",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapPin size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Main Office</h4>
              <p style={{ margin: "5px 0 0 0", color: "var(--text-gray)" }}>
                123 Hero Heights, Tech District, SV 94043
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: "20px",
              overflow: "hidden",
              borderRadius: "15px",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.6282977645198!2d-122.08385108469247!3d37.42244247982544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbba1524317d7%3A0xc6cb5a1d74366601!2sGoogleplex!5e0!3m2!1sen!2sus!4v1648485239564!5m2!1sen!2sus"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
