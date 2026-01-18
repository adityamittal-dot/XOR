import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Mail,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function GmailConnector() {
  const [isConnected, setIsConnected] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
    alert(
      "Demo mode: In production, this would redirect to Gmail OAuth."
    );
  };

  const handleFetchReports = () => {
    alert(
      "Demo mode: This would fetch lab reports from Gmail."
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Connect Gmail
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Import Lab Reports from Gmail
          </DialogTitle>
          <DialogDescription>
            Connect your Gmail account to automatically import
            lab report emails and attachments.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {!isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Connect Gmail Account
                </CardTitle>
                <CardDescription>
                  Securely connect Gmail to fetch lab reports.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button
                  onClick={handleConnect}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Connect Gmail
                </Button>

                <p className="mt-3 text-xs text-gray-500">
                  Demo only. No credentials are stored.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    Gmail Connected
                  </span>
                </div>

                <Button
                  onClick={handleFetchReports}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Fetch Lab Reports
                </Button>
              </div>

              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    No lab report emails found.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
