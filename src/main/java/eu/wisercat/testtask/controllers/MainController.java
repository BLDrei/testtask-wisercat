package eu.wisercat.testtask.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
    
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Main page");
        return "home";
    }

//    @PostMapping(value = "/filter", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    @RequestMapping("/filter")
    public String filter(@RequestBody String jsonstr, Model model) {
        model.addAttribute("name", "andrei");
//        model.addAttribute("name", "Andrei");
        model.addAttribute("email", "Thetalingjr@jksfg.comn");
        return "filter";
    }

}