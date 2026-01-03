import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/dialog";

/**
 * UI-only Gmail connector demo component.
 * No real OAuth or backend logic is implemented.
 */
export function GmailConnector() {
  const [isConnected, setIsConnected] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConnect = () => {
    // UI-only simulation of Gmail connection
    setIsConnected(true);
    alert(
      "Demo only: In production, this would redirect to Gmail OAuth."
    );
  };

  const handleFetchReports = () => {
    alert(
      "Demo only: In production, this would fetch lab reports via backend integration."
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Connect Gmail
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Lab Reports from Gmail</DialogTitle>
          <DialogDescription>
            Connect your Gmail account to automatically import lab report emails
            and attachments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Connect Gmail Account
                </CardTitle>
                <CardDescription>
                  Securely connect your Gmail to automatically fetch lab reports.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button onClick={handleConnect} className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Connect Gmail
                </Button>

                <p className="text-xs text-muted-foreground mt-3">
                  This is a demo UI. In production, OAuth permissions and
                  encryption would be handled securely by the backend.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Gmail Connected
                  </span>
                </div>

                <Button onClick={handleFetchReports} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Fetch Lab Reports
                </Button>
              </div>

              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    No lab report emails found. Click "Fetch Lab Reports" to
                    search your inbox.
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
