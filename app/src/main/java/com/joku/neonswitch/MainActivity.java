package com.joku.neonswitch;
import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.webkit.*;
import android.view.WindowManager;
public class MainActivity extends Activity {
 private WebView game;
 @Override public void onCreate(Bundle saved) {
  super.onCreate(saved);
  getWindow().setStatusBarColor(Color.rgb(8,13,25));
  getWindow().setNavigationBarColor(Color.rgb(8,13,25));
  getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
  game = new WebView(this);
  game.setBackgroundColor(Color.rgb(8,13,25));
  game.setOnApplyWindowInsetsListener((view,insets)->{
   view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());
   return insets.consumeSystemWindowInsets();
  });
  game.getSettings().setJavaScriptEnabled(true);
  game.getSettings().setDomStorageEnabled(true);
  game.getSettings().setAllowFileAccess(false);
  game.getSettings().setAllowContentAccess(false);
  game.getSettings().setBlockNetworkLoads(true);
  game.setWebViewClient(new WebViewClient(){
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){ return true; }
   @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){
    if("https://game.local/index.html".equals(r.getUrl().toString())) {
     try{return new WebResourceResponse("text/html","UTF-8",getAssets().open("index.html"));}
     catch(java.io.IOException e){return new WebResourceResponse("text/plain","UTF-8",new java.io.ByteArrayInputStream("Game asset missing".getBytes()));}
    }
    return new WebResourceResponse("text/plain","UTF-8",new java.io.ByteArrayInputStream(new byte[0]));
   }
  });
  setContentView(game);
  game.loadUrl("https://game.local/index.html");
 }
 @Override protected void onPause(){game.evaluateJavascript("window.pauseGame && window.pauseGame()",null);game.onPause();game.pauseTimers();super.onPause();}
 @Override protected void onResume(){super.onResume();if(game!=null){game.onResume();game.resumeTimers();}}
 @Override public void onBackPressed(){game.evaluateJavascript("window.pauseGame && window.pauseGame()",null);}
 @Override protected void onDestroy(){if(game!=null)game.destroy();super.onDestroy();}
}
