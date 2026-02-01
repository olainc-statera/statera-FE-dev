"use client";

import { useState } from "react";
import Image from "next/image";
import { MobileShell } from "@/components/mobile-shell";
import {
  MessageCircle,
  Heart,
  Share2,
  Plus,
  Filter,
  Star,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const memberPosts = [
  {
    id: "1",
    user: {
      name: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      memberSince: "8 months",
    },
    content: "Just hit my 50th class milestone here! The sunrise yoga sessions have completely transformed my mornings. Thank you Flow State team!",
    likes: 47,
    comments: 12,
    timestamp: "2h ago",
    className: "Sunrise Vinyasa Flow",
  },
  {
    id: "2",
    user: {
      name: "Mike R.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      memberSince: "3 months",
    },
    content: "Elena's Pilates class is no joke! Feeling the burn but in the best way possible. Who's joining tomorrow?",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    likes: 32,
    comments: 8,
    timestamp: "5h ago",
    className: "Power Pilates",
  },
];

const reviews = [
  {
    id: "1",
    user: {
      name: "Emma L.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
    rating: 5,
    content: "Absolutely love this studio! The instructors are incredibly knowledgeable and the atmosphere is so welcoming. Been coming here for 6 months and never looked back.",
    date: "2 weeks ago",
    class: "Sunrise Vinyasa Flow",
    helpful: 12,
    replied: true,
  },
  {
    id: "2",
    user: {
      name: "James K.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    rating: 5,
    content: "Clean facilities, great schedule variety, and the community here is amazing. Worth every penny.",
    date: "1 month ago",
    class: "HIIT Express",
    helpful: 8,
    replied: false,
  },
  {
    id: "3",
    user: {
      name: "Lisa T.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    rating: 4,
    content: "Great classes but can get crowded during peak hours. Recommend booking early!",
    date: "1 month ago",
    class: "Power Pilates",
    helpful: 5,
    replied: true,
  },
];

const topMembers = [
  { rank: 1, name: "Sarah M.", classes: 52, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
  { rank: 2, name: "Mike R.", classes: 38, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { rank: 3, name: "Emma L.", classes: 35, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
];

export default function StudioCommunityPage() {
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  return (
    <MobileShell variant="studio">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">
              Community
            </h1>
            <p className="text-sm text-muted-foreground">
              Engage with your members
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Post Update
          </Button>
        </div>
      </header>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-muted mx-4 mt-4 max-w-[calc(100%-2rem)]">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="posts">Member Posts</TabsTrigger>
          <TabsTrigger value="members">Top Members</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="px-4 py-4 space-y-4">
          {/* Rating Overview */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">4.9</p>
                <div className="flex items-center justify-center gap-0.5 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 5 ? "fill-primary text-primary" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">328 reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">
                      {stars}
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${stars === 5 ? 85 : stars === 4 ? 10 : 5}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">
                      {review.user.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? "fill-primary text-primary"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {review.class}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {review.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful ({review.helpful})
                </button>
                <Dialog
                  open={replyDialogOpen && selectedReviewId === review.id}
                  onOpenChange={(open) => {
                    setReplyDialogOpen(open);
                    if (!open) setSelectedReviewId(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedReviewId(review.id)}
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1" />
                      {review.replied ? "View Reply" : "Reply"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reply to Review</DialogTitle>
                      <DialogDescription>
                        Respond to {review.user.name}{"'"}s review
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="bg-muted rounded-lg p-3 mb-4">
                        <p className="text-sm text-muted-foreground">
                          {review.content}
                        </p>
                      </div>
                      <Textarea
                        placeholder="Write your reply..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setReplyDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => setReplyDialogOpen(false)}>
                        Post Reply
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="posts" className="px-4 py-4 space-y-4">
          {memberPosts.map((post) => (
            <div
              key={post.id}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">
                      {post.user.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {post.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Member for {post.user.memberSince}
                  </p>
                </div>
              </div>

              {post.className && (
                <Badge variant="secondary" className="text-xs mb-2">
                  {post.className}
                </Badge>
              )}

              <p className="text-sm text-foreground leading-relaxed mb-3">
                {post.content}
              </p>

              {post.image && (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt="Post image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </span>
                <Button variant="ghost" size="sm" className="ml-auto text-xs">
                  <MessageCircle className="w-3.5 h-3.5 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="members" className="px-4 py-4 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-4">
              Top Members This Month
            </h3>
            <div className="space-y-3">
              {topMembers.map((member) => (
                <div
                  key={member.rank}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    member.rank === 1 ? "bg-primary/10" : "bg-muted/50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      member.rank === 1
                        ? "bg-primary text-primary-foreground"
                        : member.rank === 2
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {member.rank}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.classes} classes
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Total active members: <span className="font-bold text-foreground">847</span>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </MobileShell>
  );
}
