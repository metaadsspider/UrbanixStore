import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const INSTAGRAM_URL = "https://www.instagram.com/urbanixstore07";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-display font-bold text-gradient">Urbanix</span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-sm">
              Premium streetwear for the modern urban lifestyle. Express yourself with our exclusive collections.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span>@urbanixstore07</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=clothes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Clothes
                </Link>
              </li>
              <li>
                <Link to="/products?category=caps" className="text-muted-foreground hover:text-foreground transition-colors">
                  Caps
                </Link>
              </li>
              <li>
                <Link to="/products?category=sunglasses" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sunglasses
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Shipping Info
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Returns
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 Urbanix. All rights reserved.</p>
          <p>Made with ❤️ for streetwear lovers</p>
        </div>
      </div>
    </footer>
  );
}
