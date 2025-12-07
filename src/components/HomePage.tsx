import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

interface HomePageProps {
  peripheryProducts: Product[];
  gamesProducts: Product[];
  addToCart: (product: Product) => void;
  emailForUpdates: string;
  setEmailForUpdates: (email: string) => void;
  subscribeToUpdates: () => void;
}

export function HomePage({ 
  peripheryProducts, 
  gamesProducts, 
  addToCart, 
  emailForUpdates, 
  setEmailForUpdates, 
  subscribeToUpdates 
}: HomePageProps) {
  return (
    <div className="space-y-12 animate-fade-in">
      <section className="text-center py-12 space-y-6">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-glow">
          For gamers. By gamers
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Топовая периферия для игр и лучшие видеоигры в одном месте. Cyberpunk 2077, Elden Ring, Atomic Heart и эксклюзивные девайсы для настоящих геймеров. Подпишись на рассылку и получай уведомления о новинках и скидках!
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
  );
}