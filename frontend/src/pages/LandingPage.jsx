import React, { useRef, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import berasImage from "@/assets/beras.jpg";
import bimoliImage from "@/assets/bimoli.jpg";
import indomieImage from "@/assets/download.jpg";
import tepungImage from "@/assets/segitigabiru.jpg";
import sunlightImage from "@/assets/sunlight.jpg";
import tokoLionLogo from "@/assets/tokolionLogo.jpg";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create refs for each section
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  // Scroll handler function
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false); // Close mobile menu after clicking
  };

  // Array produk dengan gambar dan detail
  const products = [
    {
      name: "Beras Super",
      image: berasImage,
      price: "Rp. 70.000",
      description: "Beras premium kualitas terbaik 5kg",
    },
    {
      name: "Minyak Goreng Bimoli",
      image: bimoliImage,
      price: "Rp. 38.000",
      description: "Minyak goreng berkualitas 2L",
    },
    {
      name: "Indomie Goreng",
      image: indomieImage,
      price: "Rp. 3.000",
      description: "Mi instan favorit keluarga",
    },
    {
      name: "Tepung Segitiga Biru",
      image: tepungImage,
      price: "Rp. 12.500",
      description: "Tepung terigu serbaguna 1kg",
    },
    {
      name: "Sunlight",
      image: sunlightImage,
      price: "Rp. 15.000",
      description: "Sabun cuci piring hemat 800ml",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Improved Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Toko Lion
              </span>
            </div>

            {/* Mobile menu button */}
            <div className="block lg:hidden">
              <button
                className="flex items-center px-3 py-2 border rounded text-blue-500 border-blue-500 hover:text-blue-700 hover:border-blue-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg
                  className="fill-current h-3 w-3"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
              </button>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden w-full lg:flex lg:w-auto lg:items-center">
              <div className="text-sm lg:flex-grow lg:text-right">
                <button
                  onClick={() => scrollToSection(homeRef)}
                  className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-700 mr-6"
                >
                  Beranda
                </button>
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-700 mr-6"
                >
                  Tentang Kami
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-700 mr-6"
                >
                  Kontak
                </button>
                <Link
                  to="/login"
                  className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-700 mr-6"
                >
                  Login Kasir
                </Link>
                <Link
                  to="/admin/login"
                  className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-700 mr-6"
                >
                  Login Admin
                </Link>
                <Link
                  to="/register"
                  className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-700"
                >
                  Daftar
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile Nav Links */}
          <div
            className={`w-full lg:hidden pt-3 pb-1 ${
              mobileMenuOpen ? "block" : "hidden"
            }`}
          >
            <div className="text-sm flex flex-col">
              <button
                onClick={() => scrollToSection(homeRef)}
                className="block py-2 text-blue-500 hover:text-blue-700"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection(aboutRef)}
                className="block py-2 text-blue-500 hover:text-blue-700"
              >
                Tentang Kami
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="block py-2 text-blue-500 hover:text-blue-700"
              >
                Kontak
              </button>
              <Link
                to="/login"
                className="block py-2 text-blue-500 hover:text-blue-700"
              >
                Login Kasir
              </Link>
              <Link
                to="/admin/login"
                className="block py-2 text-blue-500 hover:text-blue-700"
              >
                Login Admin
              </Link>
              <Link
                to="/register"
                className="block py-2 text-blue-500 hover:text-blue-700"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Home Section */}
      <section
        ref={homeRef}
        className="py-20 flex flex-col items-center justify-center"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-10 h-10 text-blue-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Toko Lion
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Sistem Manajemen Toko</p>
          </div>

          <div className="w-full max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Produk Unggulan
            </h2>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {products.map((product, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-1 h-full">
                      <Card className="h-full flex flex-col">
                        <CardContent className="p-4">
                          <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                          <h3 className="font-semibold text-lg">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {product.description}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center mt-auto p-4 pt-0">
                          <p className="font-bold text-lg text-blue-600">
                            {product.price}
                          </p>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden sm:block">
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </div>
            </Carousel>
          </div>

          <div className="w-full max-w-6xl mx-auto mt-8 text-center">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/landing")}
            >
              Lihat Semua Produk
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section ref={aboutRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tentang Kami
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                <img
                  src={tokoLionLogo}
                  alt="Toko Lion"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>

              <div className="md:w-1/2 mt-6 md:mt-0">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Sejarah Toko Lion
                </h3>
                <p className="text-gray-600 mb-4">
                  Toko Lion didirikan pada tahun 2000 dengan visi menyediakan
                  kebutuhan sehari-hari dengan kualitas terbaik dan harga
                  terjangkau untuk masyarakat.
                </p>
                <p className="text-gray-600 mb-4">
                  Dengan pengalaman lebih dari 25 tahun, kami selalu berkomitmen
                  untuk memberikan pelayanan prima dan produk berkualitas untuk
                  seluruh pelanggan setia kami.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Package className="w-6 h-6 text-blue-500" />
                    <span className="text-gray-700 font-medium">
                      500+ Produk
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-500" />
                    <span className="text-gray-700 font-medium">
                      1000+ Pelanggan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kontak Kami
          </h2>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Telepon</h3>
              <p className="text-gray-600">+62 895 3329 90750</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">cessywijaya@gmail.com</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Alamat</h3>
              <p className="text-gray-600">Gang Kembang Sepatu</p>
              <p className="text-gray-600">NO.26 RT010/RW010</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="w-6 h-6 text-blue-500" />
            <span className="font-semibold text-gray-800">Toko Lion</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 Toko Lion. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <button
              onClick={() => scrollToSection(homeRef)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Kontak
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
