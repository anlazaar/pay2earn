"use client";

import React from "react";

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-black pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-indigo-600 rounded-md"></div>
              <span className="font-bold text-xl">Loyvo</span>
            </div>
            <p className="text-neutral-500 text-sm">
              San Francisco, CA
              <br />
              Designed for the future.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">Integrations</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Changelog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="hover:text-white cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-white cursor-pointer">
                Terms of Service
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
          <p>© 2024 Loyvo Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Twitter</span>
            <span>LinkedIn</span>
            <span>GitHub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
