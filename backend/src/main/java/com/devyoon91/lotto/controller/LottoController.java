package com.devyoon91.lotto.controller;

import com.devyoon91.lotto.domain.*;
import com.devyoon91.lotto.dto.*;
import com.devyoon91.lotto.service.LottoVendingMachine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lotto")
public class LottoController {

    @PostMapping("/buy")
    public ResponseEntity<LottoBuyResponse> buyLotto(@RequestBody LottoBuyRequest request) {
        int purchaseAmount = request.getPurchaseAmount();
        List<String> manualNumbers = request.getManualNumbers() != null
            ? request.getManualNumbers() : new ArrayList<>();

        // 구매 금액 검증
        if (purchaseAmount < 1000) {
            throw new IllegalArgumentException("구매 금액은 최소 1,000원 이상이어야 합니다.");
        }
        if (purchaseAmount % 1000 != 0) {
            throw new IllegalArgumentException("구매 금액은 1,000원 단위여야 합니다.");
        }

        int maxCount = purchaseAmount / 1000;

        // 수동 번호 개수 검증
        if (manualNumbers.size() > maxCount) {
            throw new IllegalArgumentException(
                String.format("수동 구매 개수(%d)가 구매 가능 개수(%d)를 초과합니다.",
                    manualNumbers.size(), maxCount));
        }

        // 각 수동 번호 검증
        for (int i = 0; i < manualNumbers.size(); i++) {
            String line = manualNumbers.get(i);
            String[] parts = line.split(",");
            if (parts.length != 6) {
                throw new IllegalArgumentException(
                    String.format("%d번째 줄: 로또 번호는 6개여야 합니다. (현재 %d개)", i + 1, parts.length));
            }
            List<Integer> nums = new ArrayList<>();
            for (String p : parts) {
                int n;
                try {
                    n = Integer.parseInt(p.trim());
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException(
                        String.format("%d번째 줄: '%s'은 유효한 숫자가 아닙니다.", i + 1, p.trim()));
                }
                if (n < 1 || n > 45) {
                    throw new IllegalArgumentException(
                        String.format("%d번째 줄: 번호 %d는 1~45 범위를 벗어납니다.", i + 1, n));
                }
                nums.add(n);
            }
            if (new HashSet<>(nums).size() != 6) {
                throw new IllegalArgumentException(
                    String.format("%d번째 줄: 중복된 번호가 있습니다.", i + 1));
            }
        }

        Lottos lottos = LottoVendingMachine.buyLottery(manualNumbers, purchaseAmount);

        List<LottoNumberDto> lottoDtos = lottos.getLottos().stream()
            .map(lotto -> new LottoNumberDto(
                lotto.getLottoNumbers().stream()
                    .map(LottoNumber::getLottoNumber)
                    .sorted()
                    .collect(Collectors.toList()),
                lotto.isAutoGeneration()
            ))
            .collect(Collectors.toList());

        int autoCount = (int) lottos.getLottos().stream().filter(Lotto::isAutoGeneration).count();
        int manualCount = (int) lottos.getLottos().stream().filter(l -> !l.isAutoGeneration()).count();

        return ResponseEntity.ok(new LottoBuyResponse(autoCount, manualCount, lottoDtos));
    }

    @PostMapping("/result")
    public ResponseEntity<LottoResultResponse> checkResult(@RequestBody LottoResultRequest request) {
        // 당첨 번호 파싱 및 검증 (DTO는 String "1,2,3,4,5,6" 형식)
        String winningNumberStr = request.getWinningNumbers();
        if (winningNumberStr == null || winningNumberStr.isBlank()) {
            throw new IllegalArgumentException("당첨 번호를 입력해주세요.");
        }
        String[] parts = winningNumberStr.split(",");
        if (parts.length != 6) {
            throw new IllegalArgumentException("당첨 번호는 6개여야 합니다.");
        }
        List<Integer> parsedWinning = new ArrayList<>();
        for (String p : parts) {
            int n;
            try {
                n = Integer.parseInt(p.trim());
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException(
                    String.format("당첨 번호 '%s'은 유효한 숫자가 아닙니다.", p.trim()));
            }
            if (n < 1 || n > 45) {
                throw new IllegalArgumentException(
                    String.format("당첨 번호 %d는 1~45 범위를 벗어납니다.", n));
            }
            parsedWinning.add(n);
        }
        if (new HashSet<>(parsedWinning).size() != 6) {
            throw new IllegalArgumentException("당첨 번호에 중복이 있습니다.");
        }

        int bonusNumber = request.getBonusNumber();
        if (bonusNumber < 1 || bonusNumber > 45) {
            throw new IllegalArgumentException(
                String.format("보너스 번호 %d는 1~45 범위를 벗어납니다.", bonusNumber));
        }
        if (parsedWinning.contains(bonusNumber)) {
            throw new IllegalArgumentException("보너스 번호가 당첨 번호와 중복됩니다.");
        }

        List<Lotto> lottoList = request.getLottos().stream()
            .map(numbers -> {
                List<LottoNumber> lottoNumbers = numbers.stream()
                    .map(LottoNumber::of)
                    .collect(Collectors.toList());
                return new Lotto(lottoNumbers);
            })
            .collect(Collectors.toList());

        Lottos lottos = new Lottos(lottoList);
        List<LottoResult> lottoResults = LottoVendingMachine.lottoWinningResults(
            lottos, winningNumberStr, bonusNumber
        );

        LottoWinningResults winningResults = LottoWinningStatistics.getStatistics(lottoResults);
        BigInteger profit = LottoWinningStatistics.getProfit(winningResults);

        List<WinningStatItem> stats = new ArrayList<>();
        for (LottoWinningResult wr : winningResults.getLottoWinningResults()) {
            LottoResult result = wr.getLottoResult();
            boolean bonusMatch = result == LottoResult.SECOND;
            stats.add(new WinningStatItem(result.name(), result.getWinningCount(), bonusMatch, result.getPrize(), wr.getCount()));
        }

        int purchaseAmount = request.getPurchaseAmount();
        double profitRate = purchaseAmount > 0
            ? Math.round((profit.doubleValue() / purchaseAmount) * 100) / 100.0 : 0.0;
        boolean isProfit = profitRate >= 1.0;

        return ResponseEntity.ok(new LottoResultResponse(stats, profitRate, isProfit, profit.longValue()));
    }
}
