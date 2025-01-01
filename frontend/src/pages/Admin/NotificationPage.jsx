import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/component/AdminLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Bell,
  Check,
  CheckCheck,
  Info,
  MoreVertical,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Dummy data untuk notifikasi
const dummyNotifications = [
  {
    id: 1,
    type: "info",
    message: "Pesanan baru #12345 telah diterima",
    time: "5 menit yang lalu",
    isRead: false,
  },
  {
    id: 2,
    type: "warning",
    message: "Stok produk 'Laptop Asus X441' hampir habis",
    time: "1 jam yang lalu",
    isRead: false,
  },
  {
    id: 3,
    type: "success",
    message: "Pembayaran #54321 telah berhasil diverifikasi",
    time: "2 jam yang lalu",
    isRead: true,
  },
  {
    id: 4,
    type: "error",
    message: "Gagal memproses pembayaran #98765",
    time: "3 jam yang lalu",
    isRead: false,
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [filter, setFilter] = useState("all");

  // Fungsi untuk menandai notifikasi sebagai sudah dibaca
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Fungsi untuk menandai semua notifikasi sebagai sudah dibaca
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  // Fungsi untuk menghapus notifikasi
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  // Fungsi untuk mendapatkan ikon berdasarkan tipe notifikasi
  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  // Filter notifikasi berdasarkan status
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Notifikasi</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daftar Notifikasi</CardTitle>
            <div className="flex gap-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter notifikasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="unread">Belum Dibaca</SelectItem>
                  <SelectItem value="read">Sudah Dibaca</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="flex items-center gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Tandai Semua Dibaca
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada notifikasi
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start justify-between p-4 rounded-lg border ${
                      !notification.isRead ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="flex gap-4">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-sm text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Badge variant="secondary">Baru</Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.isRead && (
                            <DropdownMenuItem
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Tandai Dibaca
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
