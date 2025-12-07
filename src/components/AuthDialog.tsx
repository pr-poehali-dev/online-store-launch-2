import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AuthDialogProps {
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  handleAuth: (email: string, password: string) => void;
  handleSocialAuth: (provider: string) => void;
}

export function AuthDialog({
  showAuthDialog,
  setShowAuthDialog,
  authMode,
  setAuthMode,
  handleAuth,
  handleSocialAuth
}: AuthDialogProps) {
  return (
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
  );
}
