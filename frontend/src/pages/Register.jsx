import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, User } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import Table from "@/components/component/Table.jsx";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Semua field harus diisi!",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Format Email Salah",
        text: "Mohon masukkan email yang valid",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/users/", {
        name,
        email,
        password,
        role: "ADMIN", // Role is always set to ADMIN
      });

      if (response.data) {
        await Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil!",
          text: "Akun admin berhasil dibuat",
        });
        navigate("/"); // Redirect to login page after successful registration
      }
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Terjadi kesalahan saat registrasi";
      if (error.response) {
        // Use error message from API if available
        errorMessage = error.response.data.message || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-100">
                <User size={32} className="text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-bold">
              Register Akun Admin
            </CardTitle>
            <CardDescription className="text-center">
              Masukkan username dan password untuk login ke aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="mt-4" onSubmit={handleRegister}>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nama
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan Nama Anda"
                      className="pl-10"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Buat Email"
                      className="pl-10"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Buat Akun
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
