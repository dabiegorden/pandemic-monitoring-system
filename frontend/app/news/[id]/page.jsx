"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  ArrowUpRight,
  Facebook,
  Twitter,
  Linkedin,
  Bell,
  BellOff,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NewsDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const router = useRouter();
  const [newsDetails, setNewsDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [smsEnabled, setSmsEnabled] = useState(false);

  useEffect(() => {
    // Fetch user data to check if SMS notifications are enabled
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setSmsEnabled(!!userData.phone_number);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!id) {
      setError("Invalid news ID");
      setLoading(false);
      return;
    }

    const fetchNewsDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!response.ok) throw new Error("Failed to fetch news details");
        const data = await response.json();
        setNewsDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsDetails.title,
          text: newsDetails.description,
          url: window.location.href,
        });
      } catch (err) {
        setShowShareMenu(!showShareMenu);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Add actual bookmark functionality here
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSmsPreferenceClick = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    router.push("/profile");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading news details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>Error loading news: {error}</AlertDescription>
      </Alert>
    );
  }

  if (!newsDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">News article not found.</p>
        <Button onClick={() => router.push("/news")}>
          Return to News List
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <article className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-gray-100 md:mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>

          <div className="space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              {newsDetails.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(newsDetails.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{newsDetails.time}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSmsPreferenceClick}
                        className={`whitespace-nowrap ${
                          smsEnabled ? "bg-blue-50" : ""
                        }`}
                      >
                        {smsEnabled ? (
                          <>
                            <Bell className="w-4 h-4 mr-2 text-blue-500" />
                            SMS On
                          </>
                        ) : (
                          <>
                            <BellOff className="w-4 h-4 mr-2" />
                            SMS Off
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {smsEnabled
                        ? "You will receive SMS notifications for new pandemic updates"
                        : "Add your phone number in profile to receive SMS notifications"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="whitespace-nowrap"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>

                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 p-2 bg-white rounded-lg shadow-lg border z-10">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() =>
                            window.open(
                              `https://facebook.com/share/url=${window.location.href}`
                            )
                          }
                        >
                          <Facebook className="w-4 h-4 mr-2" />
                          Facebook
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() =>
                            window.open(
                              `https://twitter.com/intent/tweet?url=${window.location.href}`
                            )
                          }
                        >
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() =>
                            window.open(
                              `https://linkedin.com/shareArticle?url=${window.location.href}`
                            )
                          }
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={`whitespace-nowrap ${
                    isBookmarked ? "bg-blue-50" : ""
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 mr-2 ${
                      isBookmarked ? "fill-blue-500" : ""
                    }`}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
          <img
            src={newsDetails.image_url || "/api/placeholder/1200/675"}
            alt={newsDetails.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {newsDetails.description}
          </p>

          {newsDetails.read_more && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg inline-flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-4">
                Want to learn more?
              </h2>
              <p className="mb-4">
                Read the full article on the original source for more detailed
                information:
              </p>
              <Link
                href={newsDetails.read_more}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:text-blue-700 font-medium group"
              >
                Visit Original Article
                <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>

              <Link
                href={"/news"}
                className="inline-flex py-2 px-4 text-white bg-blue-600 rounded-md shadow-lg text-center items-center justify-center hover:bg-transparent hover:ring-2 hover:ring-blue-600 hover:text-black hover:transition hover:ease-in-out hover:duration-300"
              >
                Back to news page
              </Link>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
