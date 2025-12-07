import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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

interface CartAndCheckoutProps {
  currentPage: Page;
  cart: CartItem[];
  setCurrentPage: (page: Page) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  getTotalPrice: () => number;
  placeOrder: () => void;
  orderPlaced: boolean;
  trackingNumber: string;
  reviews: Review[];
  products: Product[];
  user: User | null;
}

export function CartAndCheckout({
  currentPage,
  cart,
  setCurrentPage,
  updateQuantity,
  removeFromCart,
  getTotalPrice,
  placeOrder,
  orderPlaced,
  trackingNumber,
  reviews,
  products,
  user
}: CartAndCheckoutProps) {
  if (currentPage === 'cart') {
    return (
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
    );
  }

  if (currentPage === 'checkout') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <h2 className="text-4xl font-bold mb-8">Оформление заказа</h2>
        <Card>
          <CardHeader>
            <CardTitle>Контактные данные</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" placeholder="Иван Иванов" defaultValue={user?.name || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="ivan@example.com" defaultValue={user?.email || ''} />
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
    );
  }

  if (currentPage === 'reviews') {
    return (
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
    );
  }

  if (currentPage === 'tracking') {
    return (
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
    );
  }

  return null;
}