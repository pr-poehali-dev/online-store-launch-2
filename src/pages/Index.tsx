import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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

type Page = 'home' | 'cart' | 'checkout' | 'reviews' | 'tracking';

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
    category: 'Аудио',
    description: 'Наушники с объёмным звуком 7.1 и шумоподавлением',
    image: '/placeholder.svg',
    rating: 4
  },
  {
    id: 4,
    name: 'Matrix Monitor 27"',
    price: 34999,
    category: 'Мониторы',
    description: '4K монитор 144Hz с HDR и минимальной задержкой',
    image: '/placeholder.svg',
    rating: 5
  },
  {
    id: 5,
    name: 'Hacker Webcam 4K',
    price: 6999,
    category: 'Видео',
    description: 'Веб-камера 4K с автофокусом и AI-обработкой',
    image: '/placeholder.svg',
    rating: 4
  },
  {
    id: 6,
    name: 'Code Desk RGB',
    price: 24999,
    category: 'Мебель',
    description: 'Геймерский стол с RGB подсветкой и кабель-менеджментом',
    image: '/placeholder.svg',
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
              <h3 className="text-3xl font-bold mb-6">Каталог товаров</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
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
      </main>

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