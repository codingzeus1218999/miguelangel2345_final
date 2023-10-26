import Header from "./Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="container mx-auto py-6">{children}</main>
    </>
  );
}
