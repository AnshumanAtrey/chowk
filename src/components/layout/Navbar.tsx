import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  PlusCircle,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = !!session?.user;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="chowk-container py-4 flex justify-between items-center px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-3xl font-bold text-chowk-primary">Chowk</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-chowk-primary transition-all font-medium"
          >
            Home
          </Link>
          
          {/* Services Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-chowk-primary transition-all font-medium">
              Services <ChevronDown className="h-4 w-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/services">All Services</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/category/business">Business</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/category/design">Design</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/category/development">Development</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/category/marketing">Marketing</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-chowk-primary transition-all font-medium"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <User className="h-4 w-4 mr-2" /> Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" /> Sign In
                </Link>
              </Button>
              <Button asChild className="bg-chowk-primary text-white hover:bg-chowk-primary-dark">
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <nav className="flex flex-col gap-4 mt-6">
              <Button asChild variant="ghost">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/services" onClick={() => setIsMenuOpen(false)}>All Services</Link>
              </Button>
              {isAuthenticated && (
                <Button asChild variant="ghost">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                </Button>
              )}
              <div className="border-t border-gray-200 my-2" />
              {isAuthenticated ? (
                <Button variant="destructive" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
