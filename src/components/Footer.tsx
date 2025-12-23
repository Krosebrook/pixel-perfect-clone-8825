import { Zap, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Team Culture?
          </h2>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            Join thousands of companies building stronger, more connected teams with Interact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="accent" size="xl">
              Start Free Trial
            </Button>
            <Button 
              size="xl"
              className="border-2 border-background/20 bg-transparent text-background hover:bg-background/10"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-2xl font-bold">Interact</span>
              </div>
              <p className="opacity-70 mb-6 max-w-sm">
                The employee experience platform that puts people first. Unite your team, amplify engagement.
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Github].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Features</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Pricing</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Integrations</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Enterprise</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-opacity">About</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Careers</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Blog</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Documentation</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Help Center</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Community</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Status</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-60">
              © 2024 Interact. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm opacity-60">
              <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
