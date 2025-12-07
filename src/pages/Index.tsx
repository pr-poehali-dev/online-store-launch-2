import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

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

type Page = 'home' | 'cart' | 'checkout' | 'reviews' | 'tracking' | 'profile';

interface User {
  name: string;
  email: string;
  avatar?: string;
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
    image: '/placeholder.svg',
    rating: 5
  },
  {
    id: 2,
    name: 'Neural Mouse Pro',
    price: 8999,
    category: 'Периферия',
    description: 'Игровая мышь с 16000 DPI и настраиваемыми кнопками',
    image: '/placeholder.svg',
    rating: 5
  },
  {
    id: 3,
    name: 'Cyber Headset X1',
    price: 15999,
    category: 'Периферия',
    description: 'Наушники с объёмным звуком 7.1 и шумоподавлением',
    image: '/placeholder.svg',
    rating: 4
  },
  {
    id: 7,
    name: 'Cyberpunk 2077',
    price: 2499,
    category: 'Видеоигры',
    description: 'Ролевая игра с открытым миром в антиутопичном Найт-Сити',
    image: '/placeholder.svg',
    rating: 5
  },
  {
    id: 8,
    name: 'Elden Ring',
    price: 2999,
    category: 'Видеоигры',
    description: 'Эпическая RPG от создателей Dark Souls и Джорджа Мартина',
    image: '/placeholder.svg',
    rating: 5
  },
  {
    id: 9,
    name: 'Atomic Heart',
    price: 2199,
    category: 'Видеоигры',
    description: 'Шутер в альтернативной реальности СССР с боевыми роботами',
    image: '/placeholder.svg',
    rating: 4
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
      total: 45997,
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
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    });
    setShowAuthDialog(false);
  };

  const handleSocialAuth = (provider: string) => {
    setUser({
      name: `User_${provider}`,
      email: `user@${provider}.ru`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`
    });
    setShowAuthDialog(false);
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
          <div className="space-y-12 animate-fade-in">
            <section className="text-center py-12 space-y-6">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-glow">
                Девайсы для настоящих гиков
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Топовая периферия, мониторы и аксессуары для работы и игр. Подпишись на рассылку и получай уведомления о новинках и скидках!
              </p>
              <div className="flex gap-3 max-w-md mx-auto mt-8">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={emailForUpdates}
                  onChange={(e) => setEmailForUpdates(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={subscribeToUpdates} className="transition-all hover:scale-105">
                  <Icon name="Mail" className="mr-2" size={18} />
                  Подписаться
                </Button>
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Icon name="Keyboard" size={32} className="text-primary" />
                Периферия
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {peripheryProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/20 animate-fade-in">
                    <CardHeader className="p-0">
                      <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <Badge className="absolute top-3 right-3">{product.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={16}
                            className={i < product.rating ? 'fill-primary text-primary' : 'text-muted'}
                          />
                        ))}
                      </div>
                      <CardTitle className="mb-2">{product.name}</CardTitle>
                      <CardDescription className="mb-4">{product.description}</CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {product.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full transition-all hover:scale-105"
                      >
                        <Icon name="ShoppingCart" className="mr-2" size={18} />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Icon name="Gamepad2" size={32} className="text-secondary" />
                Видеоигры
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gamesProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-secondary/20 animate-fade-in">
                    <CardHeader className="p-0">
                      <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <Badge variant="secondary" className="absolute top-3 right-3">{product.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={16}
                            className={i < product.rating ? 'fill-secondary text-secondary' : 'text-muted'}
                          />
                        ))}
                      </div>
                      <CardTitle className="mb-2">{product.name}</CardTitle>
                      <CardDescription className="mb-4">{product.description}</CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-secondary">
                          {product.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        onClick={() => addToCart(product)}
                        variant="secondary"
                        className="w-full transition-all hover:scale-105"
                      >
                        <Icon name="ShoppingCart" className="mr-2" size={18} />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentPage === 'cart' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold mb-8">Корзина</h2>
            {cart.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">Корзина пуста</p>
                <Button onClick={() => setCurrentPage('home')} className="mt-6">
                  Перейти к покупкам
                </Button>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id} className="animate-scale-in">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                            <p className="text-muted-foreground mb-4">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Icon name="Plus" size={16} />
                                </Button>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-primary">
                                  {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                </span>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Icon name="Trash2" size={18} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="p-6">
                  <div className="flex items-center justify-between text-2xl font-bold mb-6">
                    <span>Итого:</span>
                    <span className="text-primary">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <Button
                    onClick={() => setCurrentPage('checkout')}
                    className="w-full text-lg py-6 transition-all hover:scale-105"
                  >
                    Оформить заказ
                  </Button>
                </Card>
              </>
            )}
          </div>
        )}

        {currentPage === 'checkout' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold mb-8">Оформление заказа</h2>
            <Card>
              <CardHeader>
                <CardTitle>Контактные данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" placeholder="Иван Иванов" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="ivan@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" placeholder="+7 (999) 123-45-67" />
                </div>
                <Separator className="my-6" />
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес доставки</Label>
                  <Textarea id="address" placeholder="Город, улица, дом, квартира" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий к заказу</Label>
                  <Textarea id="comment" placeholder="Пожелания по доставке или упаковке" rows={2} />
                </div>
                <Separator className="my-6" />
                <div className="flex items-start gap-3">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    Я согласен на обработку персональных данных и принимаю условия политики конфиденциальности
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)} шт):</span>
                  <span className="font-semibold">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Доставка:</span>
                  <span className="font-semibold text-secondary">Бесплатно</span>
                </div>
                <Separator />
                <div className="flex justify-between text-2xl font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              <Button
                onClick={placeOrder}
                disabled={orderPlaced}
                className="w-full text-lg py-6 transition-all hover:scale-105"
              >
                {orderPlaced ? (
                  <>
                    <Icon name="CheckCircle" className="mr-2" size={20} />
                    Заказ оформлен!
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" className="mr-2" size={20} />
                    Оплатить заказ
                  </>
                )}
              </Button>
            </Card>
          </div>
        )}

        {currentPage === 'reviews' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold mb-8">Отзывы покупателей</h2>
            <div className="space-y-4">
              {reviews.map((review) => {
                const product = products.find(p => p.id === review.productId);
                return (
                  <Card key={review.id} className="animate-scale-in">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="mb-2">{review.author}</CardTitle>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Icon
                                key={i}
                                name="Star"
                                size={16}
                                className={i < review.rating ? 'fill-primary text-primary' : 'text-muted'}
                              />
                            ))}
                          </div>
                          <CardDescription>
                            {product?.name} • {new Date(review.date).toLocaleDateString('ru-RU')}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">Проверено</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">{review.text}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {currentPage === 'tracking' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold mb-8">Отслеживание доставки</h2>
            {trackingNumber ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Package" size={24} />
                    Заказ #{trackingNumber}
                  </CardTitle>
                  <CardDescription>Ваш заказ успешно оформлен</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Icon name="CheckCircle" size={20} className="text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Заказ оформлен</p>
                        <p className="text-sm text-muted-foreground">Сегодня, {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 animate-glow">
                        <Icon name="Package" size={20} className="text-background" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Сборка заказа</p>
                        <p className="text-sm text-muted-foreground">В процессе</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 opacity-50">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon name="Truck" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Передан в доставку</p>
                        <p className="text-sm text-muted-foreground">Ожидается</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 opacity-50">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon name="Home" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Доставлен</p>
                        <p className="text-sm text-muted-foreground">Ожидается</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Icon name="Search" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-6">У вас пока нет активных заказов</p>
                <Button onClick={() => setCurrentPage('home')}>
                  Перейти к покупкам
                </Button>
              </Card>
            )}
          </div>
        )}

        {currentPage === 'profile' && user && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold">Личный кабинет</h2>
              <Button variant="outline" onClick={handleLogout}>
                <Icon name="LogOut" className="mr-2" size={18} />
                Выйти
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription className="text-base">{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orders">История заказов</TabsTrigger>
                <TabsTrigger value="settings">Настройки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="space-y-4 mt-6">
                {orders.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground mb-6">У вас пока нет заказов</p>
                    <Button onClick={() => setCurrentPage('home')}>
                      Перейти к покупкам
                    </Button>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Заказ #{order.id}</CardTitle>
                            <CardDescription>
                              {new Date(order.date).toLocaleDateString('ru-RU')} • {order.status}
                            </CardDescription>
                          </div>
                          <Badge variant={order.status === 'Доставлен' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity} шт × {item.price.toLocaleString('ru-RU')} ₽
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Итого:</span>
                          <span className="text-primary">{order.total.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Персональные данные</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Имя</Label>
                      <Input id="profile-name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email</Label>
                      <Input id="profile-email" type="email" defaultValue={user.email} />
                    </div>
                    <Button className="w-full">
                      <Icon name="Save" className="mr-2" size={18} />
                      Сохранить изменения
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Уведомления</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Email-рассылка</p>
                        <p className="text-sm text-muted-foreground">Получать новости и спецпредложения</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Уведомления о заказах</p>
                        <p className="text-sm text-muted-foreground">Статус доставки и обновления</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
            </DialogTitle>
            <DialogDescription>
              {authMode === 'login' 
                ? 'Войдите в свой аккаунт или используйте социальные сети'
                : 'Создайте аккаунт или используйте социальные сети'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email</Label>
              <Input id="auth-email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-password">Пароль</Label>
              <Input id="auth-password" type="password" placeholder="••••••••" />
            </div>
            <Button 
              onClick={() => {
                const email = (document.getElementById('auth-email') as HTMLInputElement)?.value;
                const password = (document.getElementById('auth-password') as HTMLInputElement)?.value;
                if (email && password) handleAuth(email, password);
              }}
              className="w-full"
            >
              {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Или войти через</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSocialAuth('vk')}
                className="w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.45 14.92h-1.33c-.52 0-.68-.42-1.61-1.35-.82-.79-1.18-.89-1.38-.89-.29 0-.37.08-.37.47v1.23c0 .33-.1.53-1 .53-1.49 0-3.14-.89-4.3-2.56-1.75-2.43-2.23-4.26-2.23-4.63 0-.2.08-.39.47-.39h1.33c.35 0 .48.16.62.54.69 2.03 1.84 3.81 2.31 3.81.18 0 .26-.08.26-.54v-2.1c-.06-.98-.58-1.06-.58-1.41 0-.16.13-.32.35-.32h2.08c.29 0 .4.16.4.51v2.82c0 .29.13.4.21.4.18 0 .33-.11.65-.43 1.02-1.14 1.75-2.9 1.75-2.9.1-.2.26-.39.66-.39h1.33c.4 0 .49.2.4.51-.17.79-1.84 3.29-1.84 3.29-.15.25-.21.36 0 .64.15.21.64.62 1 1.01.64.71 1.14 1.31 1.27 1.72.14.41-.07.62-.48.62z"/>
                </svg>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSocialAuth('yandex')}
                className="w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5 2h-3.2C7.4 2 5.9 3.4 5.9 6.2v11.6c0 .9.7 1.6 1.6 1.6.9 0 1.6-.7 1.6-1.6V6.2c0-1 .6-1.6 1.6-1.6h3.2c1 0 1.6.6 1.6 1.6v1.3c0 .9.7 1.6 1.6 1.6.9 0 1.6-.7 1.6-1.6V6.2c0-2.3-1.5-4.2-4.3-4.2z"/>
                  <path d="M12.9 11.5h-1.8c-.9 0-1.6.7-1.6 1.6v4.6c0 .9.7 1.6 1.6 1.6h1.8c.9 0 1.6-.7 1.6-1.6v-4.6c0-.9-.7-1.6-1.6-1.6z"/>
                </svg>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSocialAuth('mail')}
                className="w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </Button>
            </div>

            <Button 
              variant="link" 
              className="w-full"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2024 GEEK.SHOP — Девайсы для настоящих гиков</p>
            <p className="text-sm">Email-уведомления о новинках, скидках и статусе заказа включены по умолчанию</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;