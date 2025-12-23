import { Minus, Plus, Trash2, Instagram, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";

const INSTAGRAM_URL = "https://www.instagram.com/urbanixstore07";

const formatPrice = (priceUSD: number) => `$${priceUSD.toFixed(2)}`;

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPriceUSD, clearCart } = useCart();

  const generateOrderMessage = () => {
    let message = "Hi! I'd like to place an order:\n\n";
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.title}\n`;
      message += `   Size: ${item.size}\n`;
      if (item.color) message += `   Color: ${item.color}\n`;
      message += `   Qty: ${item.quantity}\n`;
      message += `   Price: ${formatPrice(item.priceUSD * item.quantity)}\n\n`;
    });
    
    message += `Total: ${formatPrice(totalPriceUSD)}\n`;
    message += `\nPlease confirm availability and payment details.`;
    
    return encodeURIComponent(message);
  };

  const handleInstagramOrder = () => {
    // Open Instagram profile - users will need to DM manually
    // Unfortunately, Instagram doesn't support pre-filled DM messages via URL
    const message = generateOrderMessage();
    // Copy order details to clipboard
    navigator.clipboard.writeText(decodeURIComponent(message));
    window.open(INSTAGRAM_URL, "_blank");
    alert("Order details copied to clipboard! Paste it in Instagram DM.");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add some trendy items to get started
            </p>
            <Button 
              className="mt-6" 
              onClick={() => setIsOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 animate-fade-in">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-2 text-sm">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.size} {item.color && `/ ${item.color}`}
                    </p>
                    <p className="font-semibold text-primary mt-1">
                      {formatPrice(item.priceUSD)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Total</span>
                <span className="text-xl font-bold text-gradient">
                  {formatPrice(totalPriceUSD)}
                </span>
              </div>
              
              <Button
                className="w-full gap-2 bg-gradient-primary hover:opacity-90"
                size="lg"
                onClick={handleInstagramOrder}
              >
                <Instagram className="h-5 w-5" />
                Order via Instagram DM
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Order details will be copied. Paste in Instagram DM to @urbanixstore07
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
