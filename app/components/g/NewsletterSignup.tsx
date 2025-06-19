import { useState } from "react";
import { useAnalytics } from "./Analytics";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { trackNewsletterSignup } = useAnalytics();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your email service (e.g., Mailchimp, ConvertKit)
    console.log("Newsletter signup:", email);
    
    // Track the signup event
    trackNewsletterSignup(email);
    
    setIsSubmitted(true);
    setEmail("");
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you for subscribing!</h3>
        <p className="text-green-600">You'll receive our latest news updates in your inbox.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
        <p className="text-blue-100">
          Get the latest news and breaking stories delivered to your inbox.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
        >
          Subscribe to Newsletter
        </button>
      </form>
      
      <p className="text-xs text-blue-100 mt-4 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
