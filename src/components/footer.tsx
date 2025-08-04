const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto h-16 flex items-center justify-center md:px-4">
        <p className="text-sm text-muted-foreground">
          © 2024 - {new Date().getFullYear()} sdrpsps Powered by&nbsp;
          <a
            className="underline"
            href="https://github.com/sdrpsps/blog"
          >
            Nextjs Blog
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
