
import { AppProject } from "@/types/appBuilder";

/**
 * Generates React Native code from project data
 */
export const generateReactNativeCode = (project: AppProject): string => {
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
  return reactCode.trim();
};

/**
 * Generates Swift code from project data
 */
export const generateSwiftCode = (project: AppProject): string => {
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
  return swiftCode.trim();
};

/**
 * Generates Kotlin code from project data
 */
export const generateKotlinCode = (project: AppProject): string => {
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
  return kotlinCode.trim();
};

/**
 * Generates Flutter code from project data
 */
export const generateFlutterCode = (project: AppProject): string => {
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
  return flutterCode.trim();
};

/**
 * Generates code for all platforms
 */
export const generateCodeForAllPlatforms = (project: AppProject) => {
  return {
    react: generateReactNativeCode(project),
    swift: generateSwiftCode(project),
    kotlin: generateKotlinCode(project),
    flutter: generateFlutterCode(project)
  };
};
