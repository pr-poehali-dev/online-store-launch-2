import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { HomePage } from '@/components/HomePage';
import { CartAndCheckout } from '@/components/CartAndCheckout';
import { ProfilePage } from '@/components/ProfilePage';
import { AuthDialog } from '@/components/AuthDialog';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
  productId: number;
}

type Page = 'home' | 'cart' | 'checkout' | 'payment' | 'reviews' | 'tracking' | 'profile';

interface User {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: CartItem[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'Quantum Keyboard RGB',
    price: 12999,
    category: 'Периферия',
    description: 'Механическая клавиатура с RGB подсветкой и программируемыми макросами',
    image: 'https://cdn.poehali.dev/files/20201021224132-7247940-3.jpg',
    rating: 5
  },
  {
    id: 2,
    name: 'Neural Mouse Pro',
    price: 8999,
    category: 'Периферия',
    description: 'Игровая мышь с 16000 DPI и настраиваемыми кнопками',
    image: 'https://cdn.poehali.dev/files/orig (1).jpg',
    rating: 5
  },
  {
    id: 3,
    name: 'Cyber Headset X1',
    price: 15999,
    category: 'Периферия',
    description: 'Наушники с объёмным звуком 7.1 и шумоподавлением',
    image: 'https://cdn.poehali.dev/files/6022274409.jpg',
    rating: 4
  },
  {
    id: 7,
    name: 'Cyberpunk 2077',
    price: 2499,
    category: 'Видеоигры',
    description: 'Ролевая игра с открытым миром в антиутопичном Найт-Сити',
    image: 'https://cdn.poehali.dev/files/s-l1600.jpg',
    rating: 5
  },
  {
    id: 8,
    name: 'Elden Ring',
    price: 2999,
    category: 'Видеоигры',
    description: 'Эпическая RPG от создателей Dark Souls и Джорджа Мартина',
    image: 'https://cdn.poehali.dev/files/s-l1600.jpg',
    rating: 5
  },
  {
    id: 9,
    name: 'Atomic Heart',
    price: 2199,
    category: 'Видеоигры',
    description: 'Шутер в альтернативной реальности СССР с боевыми роботами',
    image: 'https://cdn.poehali.dev/files/s-l1600.jpg',
    rating: 4
  },
  {
    id: 10,
    name: 'Warhammer 40000 Darktide',
    price: 2749,
    category: 'Видеоигры',
    description: 'Кооперативный экшен в мрачной вселенной Warhammer 40K',
    image: 'https://cdn.poehali.dev/files/spotlight_image_english.jpg',
    rating: 5
  }
];

const reviews: Review[] = [
  {
    id: 1,
    author: 'Андрей К.',
    rating: 5,
    text: 'Quantum Keyboard RGB просто огонь! Переключатели отзывчивые, RGB яркая. Идеально для длинных кодинг-сессий.',
    date: '2024-12-01',
    productId: 1
  },
  {
    id: 2,
    author: 'Мария С.',
    rating: 5,
    text: 'Neural Mouse Pro - лучшая мышка что у меня была. Точность на высоте, удобная для маленькой руки.',
    date: '2024-11-28',
    productId: 2
  },
  {
    id: 3,
    author: 'Дмитрий П.',
    rating: 4,
    text: 'Matrix Monitor 27" - картинка шикарная, цвета сочные. Минус звезда за не очень удобное меню настроек.',
    date: '2024-11-25',
    productId: 4
  }
];

function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [emailForUpdates, setEmailForUpdates] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'TRK-12345678',
      date: '2024-11-15',
      total: products[0].price + products[3].price,
      status: 'Доставлен',
      items: [
        { ...products[0], quantity: 1 },
        { ...products[3], quantity: 1 }
      ]
    }
  ]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const proceedToPayment = () => {
    setCurrentPage('payment');
  };

  const placeOrder = () => {
    if (cart.length > 0) {
      const newTrackingNumber = `TRK-${Date.now().toString().slice(-8)}`;
      setTrackingNumber(newTrackingNumber);
      setOrderPlaced(true);
      setCart([]);
      setTimeout(() => {
        setCurrentPage('tracking');
      }, 1500);
    }
  };

  const subscribeToUpdates = () => {
    if (emailForUpdates) {
      alert(`Подписка оформлена! Новости будем отправлять на ${emailForUpdates}`);
      setEmailForUpdates('');
    }
  };

  const handleAuth = (email: string, password: string) => {
    setUser({
      name: email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      phone: '',
      address: ''
    });
    setShowAuthDialog(false);
  };

  const handleSocialAuth = (provider: string) => {
    setUser({
      name: `User_${provider}`,
      email: `user@${provider}.ru`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      phone: '',
      address: ''
    });
    setShowAuthDialog(false);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const peripheryProducts = products.filter(p => p.category === 'Периферия');
  const gamesProducts = products.filter(p => p.category === 'Видеоигры');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer transition-all hover:scale-105"
              onClick={() => setCurrentPage('home')}
            >
              GEEK.SHOP
            </h1>
            <nav className="flex gap-6 items-center">
              <Button
                variant={currentPage === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('home')}
                className="transition-all hover:scale-105"
              >
                <Icon name="Home" className="mr-2" size={18} />
                Главная
              </Button>
              <Button
                variant={currentPage === 'reviews' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('reviews')}
                className="transition-all hover:scale-105"
              >
                <Icon name="Star" className="mr-2" size={18} />
                Отзывы
              </Button>
              <Button
                variant={currentPage === 'tracking' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('tracking')}
                className="transition-all hover:scale-105"
              >
                <Icon name="Package" className="mr-2" size={18} />
                Доставка
              </Button>
              <Button
                variant={currentPage === 'cart' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('cart')}
                className="relative transition-all hover:scale-105"
              >
                <Icon name="ShoppingCart" className="mr-2" size={18} />
                Корзина
                {cart.length > 0 && (
                  <Badge className="ml-2 animate-scale-in">{cart.length}</Badge>
                )}
              </Button>
              {user ? (
                <Button
                  variant={currentPage === 'profile' ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage('profile')}
                  className="transition-all hover:scale-105"
                >
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowAuthDialog(true)}
                  className="transition-all hover:scale-105"
                >
                  <Icon name="LogIn" className="mr-2" size={18} />
                  Войти
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <HomePage
            peripheryProducts={peripheryProducts}
            gamesProducts={gamesProducts}
            addToCart={addToCart}
            emailForUpdates={emailForUpdates}
            setEmailForUpdates={setEmailForUpdates}
            subscribeToUpdates={subscribeToUpdates}
          />
        )}

        {(currentPage === 'cart' || currentPage === 'checkout' || currentPage === 'payment' || currentPage === 'reviews' || currentPage === 'tracking') && (
          <CartAndCheckout
            currentPage={currentPage}
            cart={cart}
            setCurrentPage={setCurrentPage}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getTotalPrice={getTotalPrice}
            proceedToPayment={proceedToPayment}
            placeOrder={placeOrder}
            orderPlaced={orderPlaced}
            trackingNumber={trackingNumber}
            reviews={reviews}
            products={products}
            user={user}
          />
        )}

        {currentPage === 'profile' && user && (
          <ProfilePage
            user={user}
            orders={orders}
            handleLogout={handleLogout}
            setCurrentPage={setCurrentPage}
            updateUserProfile={updateUserProfile}
          />
        )}
      </main>

      <AuthDialog
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        authMode={authMode}
        setAuthMode={setAuthMode}
        handleAuth={handleAuth}
        handleSocialAuth={handleSocialAuth}
      />

      <footer className="border-t border-border mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GEEK.SHOP
              </h3>
              <p className="text-sm text-muted-foreground">
                For gamers. By gamers.<br />
                Лучшие девайсы и игры для настоящих геймеров.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Юридическая информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Публичная оферта</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Обработка персональных данных</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Покупателям</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Условия оплаты</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Условия доставки</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Возврат и обмен</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">О нас</a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">Контакты</a>
                </li>
                <li className="pt-2">
                  <p className="text-xs">Email: support@geekshop.ru</p>
                  <p className="text-xs">Тел: +7 (999) 123-45-67</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <p>© 2024 GEEK.SHOP — Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;