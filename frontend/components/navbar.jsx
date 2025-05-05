"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo, navbarLinks } from "@/constants";
import { Menu, User, LogOut, AlertCircle } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import avatar from "@/public/assets/avatar.png";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef(null);

  // Fetch the current user from the session
  const fetchCurrentUser = async () => {
    try {
      setAuthError("");
      const response = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
        if (response.status === 401) {
          // Only set error for 401 unauthorized, not for normal logged out state
          setAuthError("Session expired. Please sign in again.");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setAuthError("Could not connect to authentication service");
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    // Listen for login events
    const handleUserLogin = () => {
      fetchCurrentUser();
    };

    window.addEventListener("user-login", handleUserLogin);

    return () => {
      window.removeEventListener("user-login", handleUserLogin);
    };
  }, []);

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      setAuthError("");
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        setUser(null);
        setIsProfileOpen(false);
        router.push("/sign-in");
      } else {
        setAuthError("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setAuthError("Network error during logout");
    }
  };

  const renderLogo = () => (
    <div className="flex items-center space-x-2">
      {Logo.map((logo) => (
        <Link
          href={logo.route}
          key={logo.id}
          className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition-opacity gap-1"
          aria-label="Go to homepage"
        >
          <Image
            src={logo.imgUrl || "/placeholder.svg"}
            alt="Logo"
            width={40}
            height={40}
          />
          {logo.name}
        </Link>
      ))}
    </div>
  );

  const renderDesktopNavLinks = () => (
    <div className="hidden lg:flex gap-6">
      {navbarLinks.map((link) => {
        const isActive =
          pathname === link.route || pathname.startsWith(`${link.route}/`);
        return (
          <Link
            href={link.route}
            key={link.name}
            className={cn(
              "px-3 py-2 rounded-lg transition-all duration-300 ease-in-out",
              {
                "bg-orange-500 text-white": isActive,
                "hover:bg-orange-100": !isActive,
              }
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );

  const renderUserProfile = () => (
    <div className="relative" ref={profileRef}>
      {!user ? (
        <Button
          onClick={() => router.push("/sign-in")}
          variant="outline"
          className="flex items-center space-x-2"
          aria-label="Sign in"
        >
          <span className="bg-blue-500 py-3 px-4 rounded-md cursor-pointer text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Sign In
          </span>
        </Button>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full"
            aria-expanded={isProfileOpen}
            aria-label="Open user menu"
          >
            <Image
              src={user.avatarUrl || avatar}
              width={40}
              height={40}
              alt="User Avatar"
              className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg border p-4 z-50 space-y-3">
              <div className="text-center">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full flex items-center justify-center space-x-2"
                aria-label="Log out"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Access site navigation and pages</SheetDescription>
          <div className="flex justify-between items-center mt-2">
            {renderLogo()}
            <SheetClose aria-label="Close menu" />
          </div>
        </SheetHeader>

        <div className="flex flex-col space-y-4">
          {navbarLinks.map((link) => {
            const isActive =
              pathname === link.route || pathname.startsWith(`${link.route}/`);
            return (
              <SheetClose asChild key={link.id}>
                <Link
                  href={link.route}
                  className={cn("px-4 py-2 rounded-lg transition-colors", {
                    "bg-orange-500 text-white": isActive,
                    "hover:bg-orange-100": !isActive,
                  })}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                </Link>
              </SheetClose>
            );
          })}

          {/* Show user profile in mobile menu too */}
          {user && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center space-x-3 px-4 py-2">
                <Image
                  src={user.avatarUrl || avatar}
                  width={32}
                  height={32}
                  alt="User Avatar"
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <SheetClose asChild>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full mt-2 flex items-center justify-center space-x-2"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {renderLogo()}
        {renderDesktopNavLinks()}
        <div className="flex items-center space-x-4">
          {renderUserProfile()}
          {renderMobileMenu()}
        </div>
      </div>

      {/* Auth error message */}
      {authError && (
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="mt-1">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
