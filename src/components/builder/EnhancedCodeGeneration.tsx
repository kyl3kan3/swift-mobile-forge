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
import { Loader2, Code, Check, Download, FileCode } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface EnhancedCodeGenerationProps {
  isOpen: boolean;
  onClose: () => void;
  project: AppProject | null;
}

export default function EnhancedCodeGeneration({ 
  isOpen, 
  onClose, 
  project 
}: EnhancedCodeGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [codeExplanation, setCodeExplanation] = useState("");
  const [activeTab, setActiveTab] = useState("react");
  const [generationPrompt, setGenerationPrompt] = useState("");
  const { toast } = useToast();

  const platformLabels = {
    react: "React Native",
    swift: "iOS (Swift)",
    kotlin: "Android (Kotlin)",
    flutter: "Flutter"
  };

  const generateCode = async () => {
    if (!project) return;
    
    setIsGenerating(true);
    setGeneratedCode({});
    setGenerationProgress(0);
    
    try {
      // Simulate the AI generation process with progress updates
      const updateProgress = () => {
        const interval = setInterval(() => {
          setGenerationProgress((prev) => {
            const newProgress = prev + Math.random() * 15;
            if (newProgress >= 100) {
              clearInterval(interval);
              return 100;
            }
            return newProgress;
          });
        }, 500);
        
        return interval;
      };
      
      const interval = updateProgress();
      
      // Prepare project data for AI processing
      const projectData = {
        name: project.name,
        screens: project.screens.map(screen => ({
          name: screen.name,
          components: screen.components
        }))
      };
      
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Sample generated code (in a real implementation, this would come from an AI service)
      const sampleCode = generateSampleCodeForPlatforms(project);
      
      clearInterval(interval);
      setGenerationProgress(100);
      setGeneratedCode(sampleCode);
      setCodeExplanation("This code implementation includes all the screens and components from your app design. The navigation structure has been set up with the proper routes between screens. Component styling matches your design specifications, and all functionality described in your components has been implemented.");
      
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

  const downloadCode = (code: string, platform: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name.toLowerCase().replace(/\s+/g, '-')}_${platform}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Downloaded",
      description: `${platformLabels[platform as keyof typeof platformLabels]} code has been downloaded.`
    });
  };

  // Helper function to generate sample code for different platforms
  const generateSampleCodeForPlatforms = (project: AppProject) => {
    // Generate React Native code (similar to existing implementation but enhanced)
    const reactCode = `
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';

// Define screen components
${project.screens.map(screen => `
// ${screen.name} Screen
function ${screen.name.replace(/\s+/g, '')}Screen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        ${screen.components.map(comp => {
          switch(comp.type) {
            case 'text':
              return `<Text style={styles.${comp.props.variant || 'text'}}>${comp.props.content || 'Text content'}</Text>`;
            case 'button':
              return `<TouchableOpacity 
  style={[styles.button, styles.${comp.props.variant || 'primary'}Button]} 
  onPress={() => console.log('Button pressed')}>
  <Text style={styles.buttonText}>${comp.props.label || 'Button'}</Text>
</TouchableOpacity>`;
            case 'navbar':
              return `<View style={styles.navbar}>
  ${comp.props.showBackButton ? `<TouchableOpacity onPress={() => navigation.goBack()}>
    <Text style={styles.navButton}>Back</Text>
  </TouchableOpacity>` : '<View style={{ width: 40 }} />'}
  <Text style={styles.navTitle}>${comp.props.title || 'Screen Title'}</Text>
  <View style={{ width: 40 }} />
</View>`;
            case 'list':
              return `<View style={styles.list}>
  ${(comp.props.items || []).map((item: any) => `<TouchableOpacity style={styles.listItem}>
    <Text style={styles.listItemText}>${item.title}</Text>
    ${item.price ? `<Text style={styles.listItemPrice}>${item.price}</Text>` : ''}
  </TouchableOpacity>`).join('\n  ')}
</View>`;
            case 'image':
              return `<Image 
  source={{ uri: '${comp.props.src || 'https://via.placeholder.com/150'}' }} 
  style={{ width: '100%', height: ${comp.props.height || 200}, borderRadius: 8 }}
  resizeMode="cover"
/>`;
            default:
              return `<View style={styles.component}><Text>${comp.type} component</Text></View>`;
          }
        }).join('\n        ')}
      </ScrollView>
    </SafeAreaView>
  );
}
`).join('\n')}

// Create navigation stack
const Stack = createStackNavigator();

// Main App component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="${project.screens[0]?.name.replace(/\s+/g, '') || 'Home'}"
        screenOptions={{ headerShown: false }}
      >
        ${project.screens.map(screen => 
          `<Stack.Screen name="${screen.name.replace(/\s+/g, '')}" component={${screen.name.replace(/\s+/g, '')}Screen} />`
        ).join('\n        ')}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#ffffff',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  p: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  list: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  listItemText: {
    fontSize: 16,
  },
  listItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  component: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 8,
    marginBottom: 16,
  },
});
    `;

    // Generate Swift code (enhanced) - Fixed string interpolation issues
    const swiftCode = `
import SwiftUI

// App Main Structure
@main
struct ${project.name.replace(/\s+/g, '')}App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// Content View - Main Navigation
struct ContentView: View {
    var body: some View {
        NavigationView {
            ${project.screens[0]?.name.replace(/\s+/g, '')}View()
        }
    }
}

${project.screens.map(screen => `
// ${screen.name} View
struct ${screen.name.replace(/\s+/g, '')}View: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                ${screen.components.map(comp => {
                    switch(comp.type) {
                        case 'navbar':
                            return `.navigationTitle("${comp.props.title || screen.name}")
                            .navigationBarTitleDisplayMode(.inline)
                            ${comp.props.rightIcon ? `.toolbar {
                                ToolbarItem(placement: .navigationBarTrailing) {
                                    Button(action: {}) {
                                        Image(systemName: "${comp.props.rightIcon === 'menu' ? 'line.3.horizontal' : 'cart'}")
                                    }
                                }
                            }` : ''}`;
                        case 'text':
                            return comp.props.variant === 'h1' 
                            ? `Text("${comp.props.content || 'Heading'}")
                                .font(.title)
                                .fontWeight(.bold)
                                .padding(.horizontal)`
                            : comp.props.variant === 'h2'
                            ? `Text("${comp.props.content || 'Subheading'}")
                                .font(.title2)
                                .fontWeight(.semibold)
                                .padding(.horizontal)`
                            : `Text("${comp.props.content || 'Text content'}")
                                .padding(.horizontal)`;
                        case 'button':
                            return `Button(action: {
                    print("Button tapped")
                }) {
                    Text("${comp.props.label || 'Button'}")
                        .fontWeight(.medium)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(${comp.props.variant === 'primary' ? 'Color.blue' : 'Color.white'})
                        .foregroundColor(${comp.props.variant === 'primary' ? 'Color.white' : 'Color.blue'})
                        .cornerRadius(8)
                        ${comp.props.variant === 'secondary' ? `
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.blue, lineWidth: 1)
                        )` : ''}
                }
                .padding(.horizontal)`;
                        case 'list':
                            return `VStack(spacing: 0) {
                    ${(comp.props.items || []).map((item: any) => `
                    Button(action: {}) {
                        HStack {
                            Text("${item.title}")
                                .foregroundColor(.primary)
                            Spacer()
                            ${item.price ? `Text("${item.price}")
                                .fontWeight(.medium)
                                .foregroundColor(.primary)` : ''}
                        }
                        .padding()
                        .background(Color.white)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    Divider()
                    `).join('')}
                }
                .background(Color.white)
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color(UIColor.systemGray5), lineWidth: 1)
                )
                .padding(.horizontal)`;
                        case 'image':
                            return `Image("placeholder")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(height: ${comp.props.height || 200})
                    .cornerRadius(8)
                    .padding(.horizontal)`;
                        default:
                            return `Text("${comp.type} component")
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(UIColor.systemGray6))
                    .cornerRadius(8)
                    .padding(.horizontal)`;
                    }
                }).join('\n                ')}
            }
            .padding(.vertical)
        }
        .background(Color(UIColor.systemGroupedBackground))
        .edgesIgnoringSafeArea(.bottom)
    }
}
`).join('\n')}

// Preview provider
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
    `;

    // Generate Kotlin code (enhanced)
    const kotlinCode = `
package com.example.${project.name.toLowerCase().replace(/\s+/g, '')}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ${project.name.replace(/\s+/g, '')}Theme {
                AppNavigation()
            }
        }
    }
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = "${project.screens[0]?.name.replace(/\s+/g, '') || 'Home'}"
    ) {
        ${project.screens.map(screen => 
            `composable("${screen.name.replace(/\s+/g, '')}") { 
            ${screen.name.replace(/\s+/g, '')}Screen(navController) 
        }`
        ).join('\n        ')}
    }
}

${project.screens.map(screen => `
@Composable
fun ${screen.name.replace(/\s+/g, '')}Screen(navController: NavController) {
    Scaffold(
        ${screen.components.some(c => c.type === 'navbar') ? `
        topBar = {
            TopAppBar(
                title = { Text("${screen.components.find(c => c.type === 'navbar')?.props.title || screen.name}") },
                navigationIcon = ${screen.components.find(c => c.type === 'navbar')?.props.showBackButton ? 
                    '{ IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Filled.ArrowBack, contentDescription = "Back") } }' : 
                    'null'},
                actions = {
                    ${screen.components.find(c => c.type === 'navbar')?.props.rightIcon ? 
                        `IconButton(onClick = { }) {
                        Icon(
                            imageVector = ${screen.components.find(c => c.type === 'navbar')?.props.rightIcon === 'menu' ? 
                                'Icons.Filled.Menu' : 
                                'Icons.Filled.ShoppingCart'}, 
                            contentDescription = null
                        )
                    }` : ''}
                }
            )
        },` : ''}
        content = { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                ${screen.components.filter(c => c.type !== 'navbar').length ? `item {
                    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        ${screen.components.filter(c => c.type !== 'navbar').map(comp => {
                            switch(comp.type) {
                                case 'text':
                                    return comp.props.variant === 'h1' ? 
                                        `Text(
                            text = "${comp.props.content || 'Heading'}",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold
                        )` : 
                                comp.props.variant === 'h2' ? 
                                        `Text(
                            text = "${comp.props.content || 'Subheading'}",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.SemiBold
                        )` : 
                                        `Text(
                            text = "${comp.props.content || 'Text content'}",
                            fontSize = 16.sp
                        )`;
                                case 'button':
                                    return `Button(
                            onClick = { },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(
                                backgroundColor = ${comp.props.variant === 'primary' ? 'MaterialTheme.colors.primary' : 'Color.Transparent'}
                            ),
                            shape = RoundedCornerShape(8.dp),
                            ${comp.props.variant === 'secondary' ? `border = BorderStroke(1.dp, MaterialTheme.colors.primary),` : ''}
                        ) {
                            Text(
                                text = "${comp.props.label || 'Button'}",
                                color = ${comp.props.variant === 'primary' ? 'Color.White' : 'MaterialTheme.colors.primary'},
                                modifier = Modifier.padding(8.dp)
                            )
                        }`;
                                case 'list':
                                    return `Card(
                            shape = RoundedCornerShape(8.dp),
                            elevation = 1.dp
                        ) {
                            Column {
                                ${(comp.props.items || []).map((item: any, idx: number) => `
                                ${idx > 0 ? 'Divider()' : ''}
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { }
                                        .padding(16.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(text = "${item.title}")
                                    ${item.price ? `Text(
                                        text = "${item.price}",
                                        fontWeight = FontWeight.Medium
                                    )` : ''}
                                }
                                `).join('')}
                            }
                        }`;
                                default:
                                    return `Text(
                            text = "${comp.type} component",
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
                                .padding(16.dp)
                        )`;
                            }
                        }).join('\n                        ')}
                    }
                }` : ''}
            }
        }
    )
}
`).join('\n')}

@Composable
fun ${project.name.replace(/\s+/g, '')}Theme(content: @Composable () -> Unit) {
    MaterialTheme(
        colors = lightColors(
            primary = Color(0xFF007AFF),
            primaryVariant = Color(0xFF0053D3),
            secondary = Color(0xFF5AC8FA)
        ),
        content = content
    )
}
    `;
    
    // Generate Flutter code (new platform)
    const flutterCode = `
import 'package:flutter/material.dart';

void main() {
  runApp(${project.name.replace(/\s+/g, '')}App());
}

class ${project.name.replace(/\s+/g, '')}App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${project.name}',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      initialRoute: '${project.screens[0]?.name.replace(/\s+/g, '').toLowerCase() || 'home'}',
      routes: {
        ${project.screens.map(screen => 
          `'/${screen.name.replace(/\s+/g, '').toLowerCase()}': (context) => ${screen.name.replace(/\s+/g, '')}Screen(),`
        ).join('\n        ')}
      },
    );
  }
}

${project.screens.map(screen => `
class ${screen.name.replace(/\s+/g, '')}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      ${screen.components.some(c => c.type === 'navbar') ? `
      appBar: AppBar(
        title: Text('${screen.components.find(c => c.type === 'navbar')?.props.title || screen.name}'),
        ${!screen.components.find(c => c.type === 'navbar')?.props.showBackButton ? 'automaticallyImplyLeading: false,' : ''}
        ${screen.components.find(c => c.type === 'navbar')?.props.rightIcon ? `
        actions: [
          IconButton(
            icon: Icon(${screen.components.find(c => c.type === 'navbar')?.props.rightIcon === 'menu' ? 
              'Icons.menu' : 
              'Icons.shopping_cart'}),
            onPressed: () {},
          ),
        ],` : ''}
      ),` : ''}
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ${screen.components.filter(c => c.type !== 'navbar').map(comp => {
                switch(comp.type) {
                  case 'text':
                    return comp.props.variant === 'h1' ? 
                      `Text(
                '${comp.props.content || 'Heading'}',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16),` : 
                    comp.props.variant === 'h2' ? 
                      `Text(
                '${comp.props.content || 'Subheading'}',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
              ),
              SizedBox(height: 12),` : 
                      `Text(
                '${comp.props.content || 'Text content'}',
                style: TextStyle(fontSize: 16),
              ),
              SizedBox(height: 16),`;
                  case 'button':
                    return comp.props.variant === 'primary' ? 
                      `ElevatedButton(
                onPressed: () {},
                child: Text('${comp.props.label || 'Button'}'),
                style: ElevatedButton.styleFrom(
                  minimumSize: Size.fromHeight(48),
                ),
              ),
              SizedBox(height: 16),` : 
                      `OutlinedButton(
                onPressed: () {},
                child: Text('${comp.props.label || 'Button'}'),
                style: OutlinedButton.styleFrom(
                  minimumSize: Size.fromHeight(48),
                ),
              ),
              SizedBox(height: 16),`;
                  case 'list':
                    return `Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  children: [
                    ${(comp.props.items || []).map((item: any, idx: number) => `
                    ${idx > 0 ? 'Divider(height: 1),' : ''}
                    ListTile(
                      title: Text('${item.title}'),
                      ${item.price ? `trailing: Text(
                        '${item.price}',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),` : ''}
                      onTap: () {},
                    ),`).join('\n                    ')}
                  ],
                ),
              }`;
                    default:
                      return `Container(
                width: double.infinity,
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text('${comp.type} component'),
              ),
              SizedBox(height: 16),`;
                }
              }).join('\n              ')}
            ],
          ),
        ),
      ),
    );
  }
}
`).join('\n')}
    `;
    
    return {
      react: reactCode.trim(),
      swift: swiftCode.trim(),
      kotlin: kotlinCode.trim(),
      flutter: flutterCode.trim()
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-500" />
            AI Code Generator
          </DialogTitle>
          <DialogDescription>
            Generate production-ready native code for your app design using artificial intelligence.
          </DialogDescription>
        </DialogHeader>

        {!generatedCode[activeTab] ? (
          <div className="space-y-4 my-4">
            <Textarea 
              placeholder="Add specific instructions or requirements for the code generation..."
              className="min-h-[100px]"
              value={generationPrompt}
              onChange={(e) => setGenerationPrompt(e.target.value)}
            />
            
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Generating code</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
                <p className="text-xs text-muted-foreground animate-pulse">
                  AI is analyzing your app design and generating code...
                </p>
              </div>
            )}
            
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="react">React Native</TabsTrigger>
                <TabsTrigger value="swift">Swift (iOS)</TabsTrigger>
                <TabsTrigger value="kotlin">Kotlin (Android)</TabsTrigger>
                <TabsTrigger value="flutter">Flutter</TabsTrigger>
              </TabsList>
              
              {Object.entries(generatedCode).map(([platform, code]) => (
                <TabsContent 
                  key={platform} 
                  value={platform}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">{platformLabels[platform as keyof typeof platformLabels]} Code</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(code)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCode(code, platform)}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md border mb-4">
                    <p className="text-sm">{codeExplanation}</p>
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
          {generatedCode[activeTab] && (
            <Button 
              onClick={() => downloadCode(generatedCode[activeTab], activeTab)}
              className="gap-2"
            >
              <FileCode className="h-4 w-4" />
              Export All Code
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
