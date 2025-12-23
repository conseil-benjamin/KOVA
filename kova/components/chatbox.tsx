import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatboxProps {
    messages: { message: string, timestamp: Date, user: string }[];
    sendMessage: () => void;
    message: string;
    setMessage: (message: string) => void;
    currentUser: string;
}

export default function Chatbox({ messages, sendMessage, message, setMessage, currentUser }: ChatboxProps) {
    return (
        <div className="w-[350px] md:w-2/6 border-l bg-background h-full">
            <Card className="h-full flex flex-col rounded-none border-0">
                <CardHeader>
                    <CardTitle>Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                    {messages.map((message, index) => {
                        const isMe = message.user === currentUser;
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] rounded-lg p-3 ${isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                                    <div className="flex justify-between items-baseline gap-2 mb-1">
                                        {!isMe && <span className="font-semibold text-xs opacity-70">{message.user}</span>}
                                        <span className={`text-[10px] ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm break-words">{message.message}</p>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
                <CardFooter className="pt-4 p-4">
                    <div className="flex w-full gap-2">
                        <Input
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            placeholder="Type a message..."
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage}>Send</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}