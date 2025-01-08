import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            <span>Detail Transaksi #{transaction.id}</span>
          </DialogTitle>
          <DialogDescription>
            Informasi detail transaksi pelanggan {transaction.customer}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pelanggan</h3>
                <p className="mt-1 text-base font-medium">
                  {transaction.customer}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tanggal</h3>
                <p className="mt-1 text-base">
                  {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Metode Pembayaran
                </h3>
                <span className="mt-1 inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {transaction.paymentMethod.charAt(0).toUpperCase() +
                    transaction.paymentMethod.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total</h3>
                <p className="mt-1 text-lg font-semibold text-blue-700">
                  Rp {transaction.totalAmount?.toLocaleString() ?? "0"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className="mt-1 inline-block px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  Selesai
                </span>
              </div>
            </div>
          </div>

          {transaction.items && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Detail Items
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Item
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Harga
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transaction.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          Rp {item.price?.toLocaleString() ?? "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                          Rp{" "}
                          {(item.quantity * item.price)?.toLocaleString() ??
                            "0"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;
