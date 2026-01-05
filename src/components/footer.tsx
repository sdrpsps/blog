const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto h-16 flex items-center justify-center md:px-4">
        <p className="text-sm text-muted-foreground">
          <span>© 2024 - {new Date().getFullYear()}</span>
          <span className="mx-1">Sunny&apos;s Blog Powered by</span>
          <a className="underline" href="https://github.com/sdrpsps/blog">
            Next.js Blog
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
