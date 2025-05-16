
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppProject } from "@/types/appBuilder";
import { Loader2, Code, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface CodeGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: AppProject | null;
}

export default function CodeGenerationDialog({ 
  isOpen, 
  onClose, 
  project 
}: CodeGenerationDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("react");
  const [generationPrompt, setGenerationPrompt] = useState("");
  const { toast } = useToast();

  const generateCode = async () => {
    if (!project) return;
    
    setIsGenerating(true);
    setGeneratedCode({});
    
    try {
      // Prepare project data for AI processing
      const projectData = {
        name: project.name,
        screens: project.screens.map(screen => ({
          name: screen.name,
          components: screen.components
        }))
      };
      
      // Simulate AI code generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Sample generated code (in a real implementation, this would come from an AI service)
      const sampleReactCode = `
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

${project.screens.map(screen => `
// ${screen.name} Screen
function ${screen.name.replace(/\s+/g, '')}Screen() {
  return (
    <View style={styles.container}>
      ${screen.components.map(comp => {
        switch(comp.type) {
          case 'text':
            return `<Text style={styles.${comp.props.variant || 'text'}}>${comp.props.content || 'Text content'}</Text>`;
          case 'button':
            return `<TouchableOpacity style={styles.button}><Text>${comp.props.label || 'Button'}</Text></TouchableOpacity>`;
          default:
            return `<View style={styles.component}><Text>${comp.type}</Text></View>`;
        }
      }).join('\n      ')}
    </View>
  );
}
`).join('\n')}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="${project.screens[0]?.name.replace(/\s+/g, '') || 'Home'}">
        ${project.screens.map(screen => 
          `<Stack.Screen name="${screen.name.replace(/\s+/g, '')}" component={${screen.name.replace(/\s+/g, '')}Screen} />`
        ).join('\n        ')}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  p: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  component: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 4,
  }
});
      `;
      
      const sampleSwiftCode = `
import SwiftUI

${project.screens.map(screen => `
// ${screen.name} Screen
struct ${screen.name.replace(/\s+/g, '')}View: View {
  var body: some View {
    ScrollView {
      VStack(spacing: 16) {
        ${screen.components.map(comp => {
          switch(comp.type) {
            case 'text':
              return comp.props.variant === 'h1' 
                ? `Text("${comp.props.content || 'Heading'}").font(.title).fontWeight(.bold)` 
                : `Text("${comp.props.content || 'Text content'}")`;
            case 'button':
              return `Button("${comp.props.label || 'Button'}") { print("Button tapped") }
              .padding()
              .background(Color.blue)
              .foregroundColor(.white)
              .cornerRadius(8)`;
            default:
              return `Text("${comp.type} component").padding().border(Color.gray)`;
          }
        }).join('\n        ')}
      }
      .padding()
    }
    .navigationTitle("${screen.name}")
  }
}
`).join('\n')}

@main
struct ${project.name.replace(/\s+/g, '')}App: App {
  var body: some Scene {
    WindowGroup {
      NavigationView {
        ${project.screens[0]?.name.replace(/\s+/g, '') || 'Home'}View()
      }
    }
  }
}
      `;
      
      const sampleKotlinCode = `
package com.example.${project.name.toLowerCase().replace(/\s+/g, '')}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppNavigation()
        }
    }
}

${project.screens.map(screen => `
@Composable
fun ${screen.name.replace(/\s+/g, '')}Screen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        ${screen.components.map(comp => {
          switch(comp.type) {
            case 'text':
              return comp.props.variant === 'h1' 
                ? `Text(text = "${comp.props.content || 'Heading'}", style = MaterialTheme.typography.h4)` 
                : `Text(text = "${comp.props.content || 'Text content'}")`;
            case 'button':
              return `Button(onClick = { /* Handle click */ }) {
            Text(text = "${comp.props.label || 'Button'}")
        }`;
            default:
              return `Text(text = "${comp.type} component")`;
          }
        }).join('\n        ')}
    }
}
`).join('\n')}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = "${project.screens[0]?.name.replace(/\s+/g, '') || 'Home'}"
    ) {
        ${project.screens.map(screen => 
          `composable("${screen.name.replace(/\s+/g, '')}") { ${screen.name.replace(/\s+/g, '')}Screen() }`
        ).join('\n        ')}
    }
}
      `;

      setGeneratedCode({
        react: sampleReactCode.trim(),
        swift: sampleSwiftCode.trim(),
        kotlin: sampleKotlinCode.trim()
      });
      
      toast({
        title: "Code Generated",
        description: "Your application code has been generated successfully!"
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Code Generation</DialogTitle>
          <DialogDescription>
            Generate native code for your app design using artificial intelligence.
          </DialogDescription>
        </DialogHeader>

        {!generatedCode[activeTab] ? (
          <div className="space-y-4 my-4">
            <Textarea 
              placeholder="Add any specific instructions for the AI code generator (optional)..."
              className="min-h-[100px]"
              value={generationPrompt}
              onChange={(e) => setGenerationPrompt(e.target.value)}
            />
            
            <Button 
              onClick={generateCode} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating code...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-4 w-4" />
                  Generate Code
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="react">React Native</TabsTrigger>
                <TabsTrigger value="swift">Swift (iOS)</TabsTrigger>
                <TabsTrigger value="kotlin">Kotlin (Android)</TabsTrigger>
              </TabsList>
              
              {Object.entries(generatedCode).map(([platform, code]) => (
                <TabsContent 
                  key={platform} 
                  value={platform}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium capitalize">{platform} Code</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(code)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Copy
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1 border rounded-md">
                    <pre className="p-4 text-xs">
                      <code>{code}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
