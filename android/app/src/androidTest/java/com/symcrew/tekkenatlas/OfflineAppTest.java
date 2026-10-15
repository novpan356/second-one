package com.symcrew.tekkenatlas;

import androidx.test.core.app.ActivityScenario;
import android.net.ConnectivityManager;
import android.content.Context;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;

/** Runs with emulator Wi-Fi/mobile data disabled, exercising the APK's bundled assets. */
@RunWith(AndroidJUnit4.class)
public class OfflineAppTest {
    private String evaluate(ActivityScenario<MainActivity> scenario, String javascript) throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        AtomicReference<String> result = new AtomicReference<>("");
        scenario.onActivity(activity -> activity.getBridge().getWebView().evaluateJavascript(javascript, value -> {
            result.set(value);
            latch.countDown();
        }));
        assertTrue("WebView evaluation timed out", latch.await(10, TimeUnit.SECONDS));
        return result.get();
    }

    private void waitFor(ActivityScenario<MainActivity> scenario, String condition) throws Exception {
        long deadline = System.currentTimeMillis() + 30000;
        while (System.currentTimeMillis() < deadline) {
            if ("true".equals(evaluate(scenario, "Boolean(" + condition + ")"))) return;
            Thread.sleep(250);
        }
        fail("Bundled app condition failed: " + condition);
    }

    @Test public void offlineRosterMovesDialogAndAndroidBack() throws Exception {
        try (ActivityScenario<MainActivity> app = ActivityScenario.launch(MainActivity.class)) {
            app.onActivity(activity -> assertEquals("com.symcrew.tekkenatlas", activity.getPackageName()));
            waitFor(app, "document.querySelectorAll('.fighter-card').length === 41");
            waitFor(app, "document.querySelector('.mobile-brand-icon').naturalWidth > 0");
            app.onActivity(activity -> {
                ConnectivityManager network = (ConnectivityManager) activity.getSystemService(Context.CONNECTIVITY_SERVICE);
                assertNull("Emulator must have no active external network", network.getActiveNetwork());
            });
            waitFor(app, "document.querySelector('.offline-notice')");
            evaluate(app, "location.hash = 'fighter/kazuya/moves'");
            waitFor(app, "document.querySelectorAll('.move-table tbody tr').length > 0");
            evaluate(app, "document.querySelector('.move-name').click()");
            waitFor(app, "document.querySelector('[role=dialog]')");
            waitFor(app, "document.querySelector('.move-effects.expanded')");
            app.onActivity(activity -> activity.getOnBackPressedDispatcher().onBackPressed());
            waitFor(app, "!document.querySelector('[role=dialog]')");
            assertEquals("\"https://localhost\"", evaluate(app, "location.origin"));
            assertEquals("\"grid\"", evaluate(app, "getComputedStyle(document.querySelector('.mobile-dock')).display"));
            assertEquals("true", evaluate(app, "document.documentElement.scrollWidth <= innerWidth"));
        }
    }
}
