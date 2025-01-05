import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/component/AdminLayout.jsx";
import axios from "axios";
import Swal from "sweetalert2";

const ManageUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    name: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.role || !formData.name) {
      setError("Semua field harus diisi");
      return false;
    }

    if (formData.password !== confirmPassword) {
      setError("Password tidak cocok");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Email tidak valid");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:3000/api/users", formData);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'User berhasil ditambahkan'
        });
        setFormData({
          email: "",
          password: "",
          role: "",
          name: "",
        });
        setConfirmPassword("");
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: error.response?.data?.message || 'Terjadi kesalahan'
        });
      }
    }
  };

  return (
    <div>
      <AdminLayout>
        <div className="">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-500" />
                <CardTitle>Tambah User Baru</CardTitle>
              </div>
              <CardDescription>
                Tambahkan user baru dengan role admin atau kasir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="KASIR">Kasir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Konfirmasi password"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 text-green-600 border-green-200">
                    <AlertDescription>
                      User berhasil ditambahkan!
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Tambah User
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </div>
  );
};

export default ManageUser;