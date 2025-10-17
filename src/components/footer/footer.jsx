import React from "react";
import { Facebook, Linkedin, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#8FD4D0] text-gray-800 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        
        <div>
          <h4 className="text-xl font-bold mb-3">DOLCI</h4>
          <p className="text-sm mb-4">Nos siga nas redes</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#78341C] transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-[#78341C] transition"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-[#78341C] transition"><Youtube size={20} /></a>
            <a href="#" className="hover:text-[#78341C] transition"><Instagram size={20} /></a>
          </div>
        </div>

       
        <div>
          <h5 className="font-semibold mb-3">Mais Pedidos</h5>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline hover:text-[#78341C]">Brigadeiro</a></li>
            <li><a href="#" className="hover:underline hover:text-[#78341C]">Bolo de cenoura</a></li>
            <li><a href="#" className="hover:underline hover:text-[#78341C]">Pudim</a></li>
          </ul>
        </div>

    
        <div>
          <h5 className="font-semibold mb-3">Páginas do site</h5>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline hover:text-[#78341C]">Produtos</a></li>
            <li><a href="#" className="hover:underline hover:text-[#78341C]">Encomendar</a></li>
            <li><a href="#" className="hover:underline hover:text-[#78341C]">Receitas</a></li>
          </ul>
        </div>

        
        <div>
          <h5 className="font-semibold mb-3">Colaboradores</h5>
          <button className="bg-[#78341C] text-white font-semibold py-1 px-5 rounded hover:bg-[#5c2815] transition">
            Login
          </button>
        </div>
      </div>

      
      <div className="text-center mt-10 text-sm text-gray-700">
        <p>© 2025 DOLCI. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
