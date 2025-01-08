import React, { useState } from "react";
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

export default function LoginUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: username,
          password,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Swal.fire("Login Berhasil");
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userId", response.data.data.id);
        sessionStorage.setItem("role", response.data.data.role);
        navigate("/user/transaksi");
      }
    } catch (error) {
      console.log(error);
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
              Login Kasir
            </CardTitle>
            <CardDescription className="text-center">
              Masukkan username dan password untuk login ke aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="mt-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Masukkan Username"
                      className="pl-10"
                      required
                      onChange={(e) => setUsername(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
