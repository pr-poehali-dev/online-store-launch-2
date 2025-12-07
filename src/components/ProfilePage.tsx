import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface ProfilePageProps {
  user: User;
  orders: Order[];
  handleLogout: () => void;
  setCurrentPage: (page: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

export function ProfilePage({ user, orders, handleLogout, setCurrentPage, updateUserProfile }: ProfilePageProps) {
  const handleSaveProfile = () => {
    const name = (document.getElementById('profile-name') as HTMLInputElement)?.value;
    const email = (document.getElementById('profile-email') as HTMLInputElement)?.value;
    const phone = (document.getElementById('profile-phone') as HTMLInputElement)?.value;
    const address = (document.getElementById('profile-address') as HTMLTextAreaElement)?.value;
    
    if (name && email) {
      updateUserProfile({ name, email, phone, address });
      alert('Данные успешно сохранены!');
    }
  };
  return (
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
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Телефон</Label>
                <Input id="profile-phone" placeholder="+7 (999) 123-45-67" defaultValue={user.phone || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-address">Адрес доставки</Label>
                <textarea
                  id="profile-address"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Город, улица, дом, квартира"
                  rows={3}
                  defaultValue={user.address || ''}
                />
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
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
  );
}