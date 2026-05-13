const fs = require("fs");
const files = [
  "shop.html",
  "cart.html",
  "about.html",
  "contact.html",
  "login.html",
];

const navFind = `<div class="nav-icons">\n            <a href="cart.html"><i class="fas fa-shopping-cart"></i> Cart</a>\n            <a href="login.html"><i class="fas fa-user"></i> Login</a>\n        </div>`;

const navReplace = `<div class="nav-icons" style="display: flex; align-items: center;">
            <button onclick="toggleTheme()" class="theme-toggle-btn" title="Toggle Dark Mode">
                <i class="fas fa-moon"></i>
            </button>
            <a href="cart.html"><i class="fas fa-shopping-cart"></i> Cart</a>
            <a href="login.html"><i class="fas fa-user"></i> Login</a>
        </div>`;

const footerFind = `<footer>\n        <p>&copy; 2025 Digital Heroes. All Rights Reserved.</p>\n    </footer>`;

const footerReplace = `<footer class="mega-footer">
        <div class="footer-columns">
            <div class="footer-col">
                <h3 style="color:var(--accent-color); font-size: 1.5rem;">Digital Heroes</h3>
                <p>Premium quality tech, fashion, and lifestyle goods delivered straight to you at unbeatable prices.</p>
                <div class="social-icons">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
            <div class="footer-col">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="shop.html">Shop All</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3>Customer Support</h3>
                <ul class="footer-links">
                    <li><a href="#">Shipping Policy</a></li>
                    <li><a href="#">Returns & Exchanges</a></li>
                    <li><a href="#">Track Order</a></li>
                    <li><a href="#">FAQ & Help Center</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3>100% Secure Shopping</h3>
                <p>We use industry-standard encryption for all transactions.</p>
                <div class="trust-badges" style="margin-top: 15px;">
                    <i class="fab fa-cc-visa"></i>
                    <i class="fab fa-cc-mastercard"></i>
                    <i class="fab fa-cc-paypal"></i>
                    <i class="fab fa-cc-stripe"></i>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Digital Heroes. All Rights Reserved. | <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
        </div>
    </footer>

    <button id="scrollTopBtn" class="scroll-to-top" title="Go to top">
        <i class="fas fa-arrow-up"></i>
    </button>`;

files.forEach((f) => {
  let content = fs.readFileSync(f, "utf8");
  // regex search for tolerance against whitespace
  content = content.replace(
    /<div class="nav-icons">\s*<a href="cart\.html"><i class="fas fa-shopping-cart"><\/i> Cart<\/a>\s*<a href="login\.html"><i class="fas fa-user"><\/i> Login<\/a>\s*<\/div>/g,
    navReplace,
  );
  content = content.replace(
    /<footer>\s*<p>&copy; 2025 Digital Heroes\. All Rights Reserved\.<\/p>\s*<\/footer>/g,
    footerReplace,
  );
  fs.writeFileSync(f, content);
  console.log("Replaced in " + f);
});
