import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./components/ui/avatar";
import { Card, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";

export default function App() {
  return (
    <div className="p-8 max-w-md">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/100" alt="User" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>

            <div>
              <CardTitle>Aditya Mittal</CardTitle>
              <Badge>Admin</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
