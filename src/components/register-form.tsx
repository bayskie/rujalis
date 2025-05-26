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
import { useRegisterMutation } from "@/hooks/use-auth-mutation";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function RegisterForm({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerMutation = useRegisterMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerMutation.mutate({ name, email, password });
  };

  return (
    // TODO: Add validation
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Daftar</CardTitle>
          <CardDescription>
            Isi form di bawah untuk membuat akun baru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={registerMutation.isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@mail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={registerMutation.isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={registerMutation.isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={registerMutation.isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Memproses..." : "Daftar"}
            </Button>

            <div className="mt-4 text-center text-sm">
              Sudah punya akun?{" "}
              <a href="/login" className="underline underline-offset-4">
                Masuk
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
