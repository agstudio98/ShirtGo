import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="w-full bg-black text-white dark:bg-white dark:text-black pt-20 pb-8 mt-24 border-t-8 border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <h2 className="text-5xl logo-font tracking-tighter">ShirtGo</h2>
            <p className="font-bold opacity-70 leading-relaxed uppercase text-sm">
              {t('FOOTER.ABOUT.DESC')}
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="p-3 border-4 border-white dark:border-black hover:bg-yellow-400 hover:text-black transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-2xl font-black uppercase mb-8 border-b-4 border-white dark:border-black inline-block">
              {t('FOOTER.LINKS.TITLE')}
            </h3>
            <ul className="space-y-4 font-bold uppercase text-sm">
              <li><Link to="/" className="hover:translate-x-2 transition-transform inline-block">{t('FOOTER.LINKS.HOME')}</Link></li>
              <li><Link to="/catalog" className="hover:translate-x-2 transition-transform inline-block">{t('FOOTER.LINKS.CATALOG')}</Link></li>
              <li><Link to="/support" className="hover:translate-x-2 transition-transform inline-block">{t('FOOTER.LINKS.SUPPORT')}</Link></li>
              <li><Link to="/user" className="hover:translate-x-2 transition-transform inline-block">{t('FOOTER.LINKS.PROFILE')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-4 border-white/20 dark:border-black/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-black text-xs uppercase tracking-widest">
            {t('FOOTER.RIGHTS')}
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase opacity-50">
            <a href="#" className="hover:opacity-100">Privacy Policy</a>
            <a href="#" className="hover:opacity-100">Terms of Service</a>
            <a href="#" className="hover:opacity-100">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
