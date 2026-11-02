import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    window.location.replace('https://dcodeias.testpress.in/');
  }, []);

  return (
    <main className="fixed inset-0 z-[100] grid h-screen w-screen place-items-center bg-white">
      <p className="font-semibold text-[#0D2C54]">Opening D'code IAS student login...</p>
    </main>
  );
}
